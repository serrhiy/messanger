'use strict';

const config = require('./config.json');
const db = require('knex')(config.db);
const load = require('./load.js')(config.sandbox);
const path = require('node:path');
const proxy = require('./proxy.js');
const fsp = require('node:fs/promises');
const mapValues = require('./mapValues.js');
const apiServer = require('./services/http2');
const checkToken = require('./checkToken.js');
const { EventEmitter } = require('node:events');
const wsServer = require('./services/websocket');
const staticServer = require('./services/static');
const resolvePaths = require('./resolvePaths.js');
const buildStaticUrls = require('./buildStaticUrls.js');

const staticpath = path.join(__dirname, 'static');
const keypath = path.join(__dirname, 'cert/key.pem');
const apipath = path.join(__dirname, 'api');
const certpath = path.join(__dirname, 'cert/cert.pem');

const tlsOptions = async (keypath, certpath) => ({
  key: await fsp.readFile(keypath),
  cert: await fsp.readFile(certpath),
});

const events = new EventEmitter();

const sandbox = {
  db,
  events,
  console,
  isString: (value) => typeof value === 'string',
  isNumber: (value) => !Number.isNaN(Number.parseInt(value)),
  common: {
    ...require('./hash.js'),
    generateToken: require('./generateToken.js'),
  },
};

const main = async () => {
  const options = await tlsOptions(keypath, certpath);
  const paths = await resolvePaths(apipath);
  const staticUrls = buildStaticUrls(paths, ['.js']);
  const controllers = await mapValues(staticUrls, load(sandbox));
  const validator = checkToken(db);
  staticServer(options, config.static.port, staticpath, proxy(db));
  apiServer(options, config.api.port, controllers, validator);
  wsServer(options, config.websocket.port, events, validator, db);
};

main();
