const debug = require('debug')('loopback:mixin:mongo-seq')

module.exports = (app, opts) => {
  debug(`initializing counter model with options ${JSON.stringify(opts)}`);

  const counterModel = app.loopback.createModel({
    name: opts.counterModelName,
    base: 'PersistedModel',
    strict: 'filter',
    options: {
      validateUpsert: true,
    },
    properties: {
      nextVal: {
        type: 'number',
      },
    },
    validations: [],
    relations: {},
    acls: [],
    methods: {},
  });
  counterModel.createSeq = async ({ name, initialVal = 1 }) => {
    const counterCollection = counterModel.getDataSource().connector.collection(counterModel.modelName);
    const { value: doc } = await counterCollection.findOneAndUpdate({ _id: name }, {
      $setOnInsert: {
        _id: name,
      },
      $set: {
        nextVal: initialVal,
      },
    }, {
      upsert: true,
      returnOriginal: false,
    });
    return doc && doc.nextVal;
  };

  counterModel.incrementSeq = async ({ name, step = 1 }) => {
    const counterCollection = counterModel.getDataSource().connector.collection(counterModel.modelName);
    const { value: doc } = await counterCollection.findOneAndUpdate({ _id: name }, {
      $inc: {
        nextVal: step,
      },
    }, {
      returnOriginal: true,
    });
    return doc && doc.nextVal;
  };

  counterModel.getSeqVal = ({ name }) => counterModel.findOne({ where: { _id: name } });
  app.model(counterModel, {
    dataSource: opts.counterModelDataSource,
    public: false,
  });

  counterModel.initializeSeq = async (Model) => {
    const highestRecord = await Model.findOne({ order: 'ID DESC', fields: ['ID'] });
    const initialVal = ((highestRecord && highestRecord[opts.seqPropertyName]) + 1) || 1;
    await counterModel.createSeq({ name: Model.modelName, initialVal });
  };
};
