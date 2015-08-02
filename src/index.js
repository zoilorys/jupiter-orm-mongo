
import { format as formatUrl } from 'url';

import { partial, concat } from 'ramda';
import { Promise } from 'es6-promise';
import { MongoClient } from 'mongodb';

/**
 * Return host from options or default host
 *
 * @access  private
 * @param   { String }  [host=localhost]  Host for connect to mongod
 */
function getHost(host) {
  return host || 'localhost';
}

/**
 * Return port from options or default port
 *
 * @access  private
 * @param   { Number }  [port=27017]  Port for connect to mongod
 */
function getPort(port) {
  return port || 27017;
}

/**
 * Return auth string if auth is passed
 *
 * @access  private
 * @param   { Object }  auth            Object with auth params
 * @param   { String }  auth.user       Name of user for auth
 * @param   { String }  auth.password   Password for user authentication
 */
function getAuth(auth) {
  return auth ? auth.user + (auth.password ? ':' + auth.password : '' ) : null;
}

/**
 * Create url from passed options or use default values. See `getAuth`,
 * `getHost` and `getPort`
 *
 * @access  private
 * @param   { Object }  options         Object for build url for connecting to
 * mongodb
 * @param   { String }  options.host    Host for connect
 * @param   { String }  options.port    Port for connect
 * @param   { Object }  options.auth    Object for auth connecting. User and
 * password options
 */
function buildConnectionUrl(options) {
  if (options.user && options.password) {
    options.auth = options.user + ':' + options.password;
  }

  return formatUrl({
    protocol: 'mongodb://',
    hostname: getHost(options.host),
    port: getPort(options.port),
    auth: getAuth(options.auth)
  });
}

/**
 * Return Query Interface
 *
 * @access  private
 * @param   { Mongodb.Db }  db              Instance of database
 * @param   { String }      collectionName  Name of collection in mongodb
 */
function QueryFactory(db, collectionName) {
  const query = {};

  return query;
}

/**
 * Create Mongodb ODM adapter
 */
export function Factory(options) {
  const adapter = {};

  adapter.query = function(db, collectionName) {
    return QueryFactory.apply(this, arguments);
  }

  adapter.close = function(db) {
    return db.close();
  };

  adapter.connect = function(opts) {
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
