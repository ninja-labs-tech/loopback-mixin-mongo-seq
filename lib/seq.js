const debug = require('debug')('loopback:mixin:mongo-seq');
const initializeCounterModel = require('./initializeCounterModel');

const defaultSeqOtps = {
  propertyName: 'ID',
  step: 1,
  readOnly: true,
  definition: {},
};

let CounterModel;
module.exports = (app, counterModelOpts) => (Model, options) => {
  if (!CounterModel) {
    CounterModel = initializeCounterModel(app, counterModelOpts);
  }
  let initializationPromise;
  const opts = Object.assign(defaultSeqOtps, options);
  const {
    propertyName, step, readOnly, initialVal, definition,
  } = opts;
  Model.defineProperty(propertyName, {
    ...definition,
    type: Number,
  });

const initializationPromise = CounterModel.initializeSeq(Model, propertyName, initialVal, step);

  Model.observe('before save', async (ctx) => {
    if (ctx.instance && ctx.isNewInstance) {
      if (ctx.instance[propertyName]) return;
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
