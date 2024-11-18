'use strict';

const path = require('node:path');
const fsp = require('node:fs/promises');
const loadEnv = require('./loadEnv.js');
const staticServer = require('./services/static');
const apiServer = require('./services/http2');

const envpath = path.join(__dirname, '.env');
const staticpath = path.join(__dirname, 'static');
const keypath = path.join(__dirname, 'cert/key.pem');
const apipath = path.join(__dirname, 'api');
const certpath = path.join(__dirname, 'cert/cert.pem');
const controllerspath = path.join(__dirname, 'controllers');

const tlsOptions = async (keypath, certpath) => ({
  key: await fsp.readFile(keypath),
  cert: await fsp.readFile(certpath),
});

const main = async () => {
  const options = await tlsOptions(keypath, certpath);
  const { port, apiport } = await loadEnv(envpath);
  staticServer(options, port, staticpath, controllerspath);
  apiServer(options, apiport, apipath);
};

main();
