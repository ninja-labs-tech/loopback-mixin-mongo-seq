const initilaizeCounterModel = require('./lib/initializeCounterModel');
const seq = require('./lib/seq');

const defaultCounterModelOpts = {
  dataSource: 'MongoDS',
  modelName: 'Counter',
};
module.exports = function loopbackMixin(app, options) {
  const CounteModelOpts = Object.assign(defaultCounterModelOpts, options);
  const CounterModel = initilaizeCounterModel(app, CounteModelOpts);
  app.loopback.modelBuilder.mixins.define('Seq', seq(CounterModel));
};
