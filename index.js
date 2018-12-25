const seq = require('./lib/seq');

const defaultCounterModelOpts = {
  dataSource: 'MongoDS',
  modelName: 'Counter',
};
module.exports = function loopbackMixin(app, options) {
  const CounteModelOpts = Object.assign(defaultCounterModelOpts, options);
  app.loopback.modelBuilder.mixins.define('Seq', seq(app, CounteModelOpts));
};
