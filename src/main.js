'use strict';

const db = require('./db.js');
const load = require('./load.js');
const path = require('node:path');
const proxy = require('./proxy.js');
const fsp = require('node:fs/promises');
const loadEnv = require('./loadEnv.js');
const mapValues = require('./mapValues.js');
const apiServer = require('./services/http2');
const checkToken = require('./checkToken.js');
const wsServer = require('./services/websocket');
const staticServer = require('./services/static');
const resolvePaths = require('./resolvePaths.js');
const buildStaticUrls = require('./buildStaticUrls.js');

const envpath = path.join(__dirname, '.env');
const staticpath = path.join(__dirname, 'static');
const keypath = path.join(__dirname, 'cert/key.pem');
const apipath = path.join(__dirname, 'api');
const certpath = path.join(__dirname, 'cert/cert.pem');

const tlsOptions = async (keypath, certpath) => ({
  key: await fsp.readFile(keypath),
  cert: await fsp.readFile(certpath),
});

const sandbox = {
  db,
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
  const { port, apiport, wsport } = await loadEnv(envpath);
  const paths = await resolvePaths(apipath);
  const staticUrls = buildStaticUrls(paths, ['.js']);
  const controllers = await mapValues(staticUrls, load(sandbox));
  const validator = checkToken(db);
  staticServer(options, port, staticpath, proxy);
  apiServer(options, apiport, controllers, validator);
  wsServer(options, wsport, controllers, validator);
};

main();
