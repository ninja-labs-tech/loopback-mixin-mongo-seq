### MONGO-SEQ ###

[loopback v3](https://loopback.io/) mixin to add support for sequential property.

### usage ###
1.
```
npm install loopback-mixin-mongo-seq
```
2. update `server.js` to load mixin:

```javascript
const loopbackMixinMongoSeq = require('loopback-mixin-mongo-seq');

loopbackMixinMongoSeq(app, {
  dataSource: 'MongoDS', modelName: 'Counter'
});

```
3. add mixins property to the required model.

```json
"mixins": {
  "Seq" : {
    "propertyName": "ID",
    "step": 1,
    "initialVal": 1,
    "readOnly": true
  }
}
```
4. options

    propertyName: property name, defaults to ID.

    step: defaults to 1.

    initialVal: value to start counter from if the sequence doesn't exist, defaults to the highest record in the target model if not found then 1.
    
    readOnly: if the value should be protested against changes, defaults
    to true.

### DEBUG MODE ###

```
DEBUG='loopback:mixin:mongo-seq'
```
