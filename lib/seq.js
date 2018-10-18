const debug = require('debug')('loopback:mixin:mongo-seq');

const defaultSeqOtps = {
  propertyName: 'ID',
  step: 1,
  readOnly: true,
  definiton: {},
};


module.exports = CounterModel => (Model, options) => {
  let initializationPromise;
  const opts = Object.assign(defaultSeqOtps, options);
  const {
    propertyName, step, readOnly, initialVal, definiton,
  } = opts;
  Model.defineProperty(propertyName, {
    ...definiton,
    type: Number,
  });

  Model.observe('before save', async (ctx) => {
    if (ctx.instance && ctx.isNewInstance) {
      if (!initializationPromise) {
        initializationPromise = CounterModel.initializeSeq(Model, propertyName, initialVal);
      }
      await initializationPromise;
      debug(`incrementing ${Model.modelName} with step ${step}`);
      ctx.instance[propertyName] = await CounterModel.incrementSeq({ name: Model.modelName, step });
      debug(`current value is ${ctx.instance[propertyName]}`);
    } else if (readOnly) {
      if (ctx.instance) {
        delete ctx.instance[propertyName];
      } else {
        delete ctx.data[propertyName];
      }
    }
  });
};
