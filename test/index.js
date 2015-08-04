
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
      port: 27017,
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
    });
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
      expect(result).to.be.instanceof(Promise);
      Adapter.close();
      done();
    });
  });
});

describe('Hooks test', function() {
  const Adapter = Factory({
    database: 'test',
  });

  before(function(done) {
    Adapter.connect().catch(done).then(function() {
      done();
    });
  });

  it('Hooks should process passing data', function(done) {
    const Query = Adapter.query('orm_test');

    hooks.registerBeforeHook('insert', function(value) {
      value.before = 'before';
      return value;
    });

    hooks.registerAfterHook('find', function(value) {
      value.after = 'after';
      return value;
    });

    Query.insert({
      key: 'value',
    }).exec();

    Query.findOne({
      key: 'value',
    }).exec().then(function(data) {
      expect(data.key).to.be.ok.and.to.be.eql('value');
      expect(data.before).to.be.ok.and.to.be.eql('before');
      expect(data.after).to.be.ok.and.to.be.eql('after');
      clearHooks('insert');
      clearHooks('find')
    });

    Query.deleteMany({
      key: 'value',
    }).exec().then(function(data) {
      Adapter.close();
      done();
    });
  });
});
