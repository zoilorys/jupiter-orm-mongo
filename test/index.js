
import { expect } from 'chai';
import { Promise } from 'es6-promise';

import { Db } from 'mongodb';

import { Factory } from '../src/index';

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

    expect(Query).to.have.all.keys('insert');

    [
      Query.insert,
    ].forEach(function(func) {
      expect(func).to.be.ok.and.to.be.a('function');
    });
  });

  // xit('Find and Insert objects API', function() {
  //   const testFinder = testQuery.find();
  //   const testInserter = testQuery.insert();
  //   expect(testFinder).to.have.all.keys('exec', 'order', 'limit');
  //   expect(testInserter).to.have.all.keys('exec');
  //
  //   [
  //     testFinder.order,
  //     testFinder.limit,
  //     testFinder.exec,
  //     testInserter.exec,
  //   ].forEach(function(func) {
  //     expect(func).to.be.ok.and.to.be.a('function');
  //   });
  // });
});

describe('Connection behavoir', function() {
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
  const Adapter = Factory();

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
