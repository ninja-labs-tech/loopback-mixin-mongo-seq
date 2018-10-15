### MONGO-SEQ ###

[loopback v3](https://loopback.io/) mixin to add support for sequential property.

### usage ###
1.
```
npm install loopback-mixin-mongo-seq
```
2. update `mixins` property in `server/model-config.json`:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "../common/mixins",
      "../node_modules/loopback-mixin-mongo-seq/lib"
    ]
  }
}
```
3. add mixins property to the required model.

```json
  "mixins": {
     "Seq" : {
       "counterModelName": "Counter",
       "counterModelDataSource": "MongoDS",
       "seqPropertyName": "ID",
       "step": 1,
       "initialVal": 1
     }
   }
```


### DEBUG MODE ###

```
  DEBUG='loopback:mixin:mongo-seq'
```
