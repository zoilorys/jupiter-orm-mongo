# jupiter-orm-mongo

## API

#### .Fabric(options)

Returns adapter API object.

**Arguments**

options - { Object } object with properties for connection.

Available options:
* host - { String } host name without protocol, e.g. '127.0.0.1'
* port - { Number } port of host server to connect
* database - { String } name of DB to connect

**Example**
```javascript
let ORM = Fabric({
  host: '127.0.0.1',
  post: 27017,
  database: 'test',
});
```

#### .connect()

Establish connection to DB. Returns adapter object.

**Example**
```javascript
let ORM = Fabric({
  // options
}).connect();

```

#### .query(collection)

Returns Query interface of adapter for selected collection.

**Arguments**

collection - { String } name of collection to query.

**Example**
```javascript
let ORM = Fabric({
  // options
})

ORM.connect().then(function() {
  ORM.query('collection')
    .find().exec()
    .then(console.log.bind(console));
});
```

#### .close()

Closes current connection.

**Example**
```javascript
let ORM = Fabric({
  // options
}).connect()

ORM.query('collection').find().exec().then(function(result) {
  doSomethingWith(result);
  ORM.close();
});

```

### Query API

#### .find(query)

Returns list of documents from collection, by query clause.

**Arguments**
query - { Object } object, that contains query сonditions.

**Example**
```javascript
let Query = Fabric({
  // options
}).connect().query('collection')

Query.find({
  query: 'clause'
}).exec().then(console.log.bind(console));

```

#### .findOne(query)

Return document from collection, by query clause

**Arguments**
query - { Object } object, that contains query сonditions.

**Example**
```javascript
let Query = Fabric({
  // options
}).connect().query('collection')

Query.findOne({
  query: 'clause'
}).exec().then(console.log.bind(console));
```

#### .insert(document)

Insert one or many documents into collection

**Arguments**
document - { Object | Array } document or documents list for inserting

**Example**
```javascript
let Query = Fabric({
  // options
}).connect().query('collection');

Query.insert({key: 'value'}).exec().then(console.log.bind(console));
Query.insert([{key1: 'value1'}, {key2: 'value2'}])
  .exec().then(console.log.bind(console));

```

#### .delete(query)

Remove one or many documents from collection

**Arguments**
query - { Object | Array } selector clause for removing

**Example**
```javascript
let Query = Fabric({
  // options
}).connect().query('collection');

Query.delete({key: 'value'}).exec().then(console.log.bind(console));

Query.delete([{key1: 'value1'}, {key2: 'value2'}])
  .exec().then(console.log.bind(console));

```

#### .update(query, value)

Update one document from collection

**Arguments**
query - { Object } selector clause for updating
value - { Object } updated value for document

**Example**
```javascript
let Query = Fabric({
  // options
}).connect().query('collection');

Query.update({key: 'value', { key: 'changedValue' }})
  .exec().then(console.log.bind(console));
```

#### .updateMany(filter, values)

Update all documents from collection

**Arguments**
filter - { Object } selector clause for updating
value - { Object } updated value for documents

**Example**
```javascript
let Query = Fabric({
  // options
}).connect().query('collection');

Query.update({key1: 'value1', { key: 'changedValue' }})
  .exec().then(console.log.bind(console));
```

### Cursor API

#### .sort(options)

Set sorting option for cursor

**Arguments**
options - { Object } object, that contains sorting options.

Object must be of type {\<key\>, \<direction\>}, where values for direction is
1 for ascending and -1 for descending.

**Example**
```javascript
Fabric({
  // options
}).connect().query('collection')
  .find().order({'name': 1}).exec()
  .then(console.log.bind(console));

```

#### .limit(value)

Set limit count of results for query

**Arguments**
value - { Number } limit for the number of returned results. 0 by default,
and it equals 'no limit'.

**Example**
```javascript
Fabric({
  // options
}).connect().query('collection')
  .find().limit(5).exec()
  .then(console.log.bind(console));

```

#### .skip(value)

Set the skip for the cursor.

**Arguments**
value - { Number } The skip for the cursor query. 0 by default

**Example**
```javascript
Fabric({
  // options
}).connect().query('collection')
  .find().skip(1).exec()
  .then(console.log.bind(console));

```

#### .exec()

Executes query and returns Promise object.

**Example**
```javascript
let ORM = Fabric({
  // options
});

ORM.connect().query('test_items').find()
  .order({'name': -1}).limit(10).exec()
  .then(function(result) {
    doSomethingWith(result);
    ORM.close();
  });
```
