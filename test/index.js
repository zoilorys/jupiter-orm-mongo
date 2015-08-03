
import { expect } from 'chai';
import { Promise } from 'es6-promise';

import { Db } from 'mongodb';

import { Factory } from '../src/index';
import { hooks } from '../src/hooks';

describe('API spec', function() {
  const Adapter = Factory();

  it('Adapter object API', function() {
    expect(Adapter).to.have.all.keys('connect', 'close', 'query');

    [
      Adapter.connect,
      Adapter.close,
      Adapter.query,
    ].forEach(function(func) {
      expect(func).to.be.ok.and.to.be.a('function');
    });
  });


  it('Query object API', function() {
    const Query = Factory().query();

    expect(Query).to.have.all.keys('insert', 'find', 'findOne', 'deleteOne', 'deleteMany', 'updateOne', 'updateMany');

    [
      Query.insert,
      Query.find,
      Query.findOne,
      Query.updateOne,
      Query.updateMany,
      Query.deleteOne,
      Query.deleteMany,
    ].forEach(function(func) {
      expect(func).to.be.ok.and.to.be.a('function');
    });
  });
});

describe('Connection behavior', function() {
  it('should be connected and disconnected', function(done) {
    const connectedFactory = Factory({
      database: 'test',
      host: 'localhost',
      port: 27017
    });

    connectedFactory.connect().catch(done).then(function(adapter) {
      expect(adapter.getDatabase()).to.be.instanceof(Db);
      adapter.close().catch(done).then(done);
    });
  });
});

describe('Create documents', function() {
  const Adapter = Factory({
    database: 'test',
  });

  before(function(done) {
    Adapter.connect().catch(done).then(function() {
      done();
    });
  });

  it('should return Promise', function() {
    const Query = Adapter.query('orm_test');

    expect(Query.insert({
      key: 'value'
    }).exec()).to.be.instanceof(Promise);

  });
});

describe('Read documents', function(done) {
  const Adapter = Factory({
    database: 'test',
  });

  before(function(done) {
    Adapter.connect().catch(done).then(function() {
      done();
    });
  });

  it('should return Promise and be equal inserted data', function() {
    const Query = Adapter.query('orm_test');

    Query.find({
      key: 'value'
    }).exec().then(function(data) {
      expect(data.key).to.be.ok.and.to.be.eql('value');
      Adapter.close();
      done();
    })
  });
});

describe('Update documents', function() {
  const Adapter = Factory({
    database: 'test',
  });

  before(function(done) {
    Adapter.connect().catch(done).then(function() {
      done();
    });
  });

  it('should return Promise and data must be updated', function(done) {
    const Query = Adapter.query('orm_test');

    const result = Query.updateOne({
      key: 'value',
    }, {
      $set: {
        param: 'value',
      }
    }).exec();

    expect(result).to.be.instanceof(Promise);

    Adapter.query('orm_test').findOne({
      key: 'value',
    }).exec().then(function(data) {
      expect(data.key).to.be.ok.and.to.be.eql('value');
      expect(data.param).to.be.ok.and.to.be.eql('value');
      Adapter.close();
      done();
    })
  });
});

describe('Delete documents', function() {
  const Adapter = Factory({
    database: 'test',
  });

  before(function(done) {
    Adapter.connect().catch(done).then(function() {
      done();
    });
  });

  it('should return Promise and data must be deleted', function(done) {
    const Query = Adapter.query('orm_test');

    const result = Query.deleteMany({
      key: 'value',
    }).exec().then(function(data) {
      expect(data.deletedCount).to.be.ok.and.to.be.eql(1);
      Adapter.close();
      done();
    });

    expect(result).to.be.instanceof(Promise);
  });
});

describe('Test hooks - before create', function() {
  const Adapter = Factory({
    database: 'test',
  });

  before(function(done) {
    Adapter.connect().catch(done).then(function() {
      done();
    });
  });

  it('should register new hooks', function() {
    const testHook = function(value) {
      value.hook = 'hook was here';
      return value;
    }

    hooks.registerHook('create before', testHook);

    expect(hooks.execHooks('create')('before')({})).to.be.ok.and.to.be.eql({ hook: 'hook was here' });
  });

  it('hook should process the data, that would be inserted', function(done) {
    const Query = Adapter.query('orm_test');

    Query.insert({
      key: 'value',
    }).exec();

    Adapter.query('orm_test').findOne({
      key: 'value',
    }).exec().then(function(data) {
      expect(data.key).to.be.ok.and.to.be.eql('value');
      expect(data.hook).to.be.ok.and.to.be.eql('hook was here');
      done();
    });

    // Cleanup
    Query.deleteMany({
      key: 'value',
    }).exec().then(function(d) {
      Adapter.close();
    });

  });

  it('clearHooks() should clear created hooks', function() {

    hooks.clearHooks('create before');

    expect(hooks.execHooks('create')('before')({})).to.be.ok.and.to.be.eql({});
  });
});

describe('Test hooks - after find', function() {
  const Adapter = Factory({
    database: 'test',
  });

  before(function(done) {
    Adapter.connect().catch(done).then(function() {
      done();
    });
  });

  it('should register new hooks', function() {
    const testHook = function(value) {
      value.hook = 'hook was here';
      return value;
    }

    hooks.registerHook('find after', testHook);

    expect(hooks.execHooks('find')('after')({})).to.be.ok.and.to.be.eql({ hook: 'hook was here' });
  });

  it('hook should process the data, that was found', function(done) {
    const Query = Adapter.query('orm_test');

    Query.insert({
      key: 'value',
    }).exec();

    Adapter.query('orm_test').findOne({
      key: 'value',
    }).exec().then(function(data) {
      expect(data.key).to.be.ok.and.to.be.eql('value');
      expect(data.hook).to.be.ok.and.to.be.eql('hook was here');
      done();
    });

    // Cleanup
    Query.deleteMany({
      key: 'value',
    }).exec().then(function(d) {
      Adapter.close();
    });

  });

  it('clearHooks() should clear created hooks', function() {

    hooks.clearHooks('find after');

    expect(hooks.execHooks('find')('after')({})).to.be.ok.and.to.be.eql({});
  });
});
