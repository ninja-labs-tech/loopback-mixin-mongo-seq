const initilaizeCounterModel = require('../helpers/initializeCounterModel');
const debug = require('debug')('loopback:mixin:mongo-seq')

const defaultOpts = {
  counterModelDataSource: 'MongoDS',
  counterModelName: 'Counter',
  seqPropertyName: 'ID',
  step: 1,
  initialVal: 1
};

module.exports = (Model, options) => {
  const opts = Object.assign(defaultOpts, options);
  let app;
  let initialized = false;
  let initializationPromise;

  Model.once('attached', () => {
    ({ app } = Model);
    if (!app.models[opts.counterModelName]) initilaizeCounterModel(app, opts);
  });

  Model.defineProperty(opts.seqPropertyName, { type: Number, index: { unique: true } });

  Model.observe('before save', async (ctx) => {
    if (ctx.instance && ctx.isNewInstance) {
      const { [opts.counterModelName]: CounterModel } = app.models;
      if (!initialized) {
        if (!initializationPromise) initializationPromise = CounterModel.initializeSeq(Model, opts.initialVal);
        await initializationPromise;
        initialized = true;
      }
      ctx.instance[opts.seqPropertyName] = await CounterModel.incrementSeq({ name: Model.modelName, step: opts.step });
      debug(`incrementing ${Model.modelName} with step ${opts.step}, current value is ${ctx.instance[opts.seqPropertyName]}`)
    } else if (ctx.instance) {
      delete ctx.instance[opts.seqPropertyName];
    } else {
      delete ctx.data[opts.seqPropertyName];
    }
  });
};
