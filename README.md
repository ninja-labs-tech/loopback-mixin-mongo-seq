### MONGO-SEQ ###

[loopback v3](https://loopback.io/) mixin to add support for sequential property.

### usage ###

* install via npm.

```shell
npm install loopback-mixin-mongo-seq
```

* update `server.js` to load mixin.

```javascript
const loopbackMixinMongoSeq = require('loopback-mixin-mongo-seq');

loopbackMixinMongoSeq(app, {
  dataSource: 'MongoDS', modelName: 'Counter'
});
```

* add mixins property to the required model.

```json
"mixins": {
  "Seq" : {
    "propertyName": "ID",
    "step": 1,
    "initialVal": 1,
    "readOnly": true,
    "definition": {
      "index": { "unique": true }
    }
  }
}
```

### options ###

_propertyName_: property name, defaults to ID.

_step_: defaults to 1.

_initialVal_: value to start counter from if the sequence doesn't exist, defaults to the highest record in the target model if not found then 1.

_readOnly_: if the value should be protested against changes, defaults
to true.

_definition_: property definition ( can be used to add index to property), defaults to {}.

### DEBUG MODE ###

```
DEBUG='loopback:mixin:mongo-seq'
```
