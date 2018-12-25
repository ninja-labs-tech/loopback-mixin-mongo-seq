const debug = require('debug')('loopback:mixin:mongo-seq');

module.exports = (app, { modelName, dataSource }) => {
  debug(`initializing counter model with options ${JSON.stringify({ modelName, dataSource })}`);

  const CounterModel = app.loopback.createModel({
    name: modelName,
    base: 'PersistedModel',
    strict: 'filter',
    properties: {
      _id: {
        type: String,
        id: true,
      },
      nextVal: {
        type: Number,
      },
    },
  });

  CounterModel.incrementSeq = async ({ name, step = 1 }) => {
    const counterCollection = CounterModel.getDataSource()
      .connector.collection(CounterModel.modelName);
    const { value: doc } = await counterCollection.findOneAndUpdate({ _id: name }, {
      $inc: {
        nextVal: step,
      },
    }, {
        returnOriginal: true,
      });
    return doc && doc.nextVal;
  };

  CounterModel.getSeq = name => CounterModel.findOne({ where: { _id: name } });

  CounterModel.setSeq = (name, val) => CounterModel.updateAll({ _id: name }, { $set: { nextVal: val } });

  CounterModel.initializeSeq = async (Model, propertyName, initialVal) => {
    const seqFound = await CounterModel.getSeq(Model.modelName);
    if (seqFound) return;
    let nextVal = initialVal;
    if (!nextVal) {
      const highestRecord = await Model.findOne({ order: `${propertyName} DESC`, fields: [propertyName] });
      nextVal = (highestRecord && highestRecord[propertyName]) ? (highestRecord[propertyName] + 1) : 1;
    }
    await CounterModel.create({ _id: Model.modelName, nextVal });
  };

  app.model(CounterModel, {
    dataSource: app.dataSources[dataSource],
    public: false,
  });

  return CounterModel;
};
