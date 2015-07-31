
import { expect } from 'chai';
import { Promise } from 'es6-promise';

import { Db } from 'mongodb';

import { Factory } from '../src/index';

describe('API spec', function() {
  const testAdapter = Factory();

  it('Adapter object API', function() {
    expect(testAdapter).to.have.all.keys('connect', 'close', 'query');

    [
      testAdapter.connect,
      testAdapter.close,
      testAdapter.query,
    ].forEach(function(func) {
      expect(func).to.be.ok.and.to.be.a('function');
    });
  });

  //
  // xit('Query object API', function() {
  //   expect(testQuery).to.have.all.keys('find', 'insert');
  //
  //   [
  //     testQuery.find,
  //     testQuery.insert,
  //   ].forEach(function(func) {
  //     expect(func).to.be.ok.and.to.be.a('function');
  //   });
  // });
  //
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
