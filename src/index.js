
import { format as formatUrl } from 'url';

import { Map } from 'immutable';
import { partial, concat } from 'ramda';
import { Promise } from 'es6-promise';
import { MongoClient } from 'mongodb';

function buildConnectionUrl(options) {
  if (options.user && options.password) {
    options.auth = options.user + ':' + options.password;
  }

  return formatUrl({
    protocol: 'mongodb://',
    hostname: options.host,
    port: options.port,
    auth: options.auth || null
  });
}

function QueryFactory(db, collectionName) {
  const query = {};

  return query;
}

export function Factory(options) {
  const adapter = {};

  adapter.query = function (db, collectionName) {
    return QueryFactory.apply(this, arguments);
  }

  adapter.close = function (db) {
    return db.close();
  };

  adapter.connect = function (opts) {
    return MongoClient.connect(buildConnectionUrl(options)).then(function(db) {

      adapter.getDatabase = function() {
        return db;
      };

      adapter.query = partial(adapter.query, db);
      adapter.close = partial(adapter.close, db);

      return adapter;
    });
  }

  return adapter;
}
