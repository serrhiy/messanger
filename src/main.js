'use strict';

const path = require('node:path');
// const https = require('node:https');
// const WebSocket = require('websocket');
const fsp = require('node:fs/promises');
const loadEnv = require('./loadEnv.js');
const staticServer = require('./services/static');
const Storage = require('./storage/fileStorage.js');
const staticControllers = require('./static.js');

const envpath = path.join(__dirname, '.env');
const staticpath = path.join(__dirname, 'static');
const keypath = path.join(__dirname, 'cert/key.pem');
const sessionspath = path.join(__dirname, 'sessions');
const certpath = path.join(__dirname, 'cert/cert.pem');

const tlsOptions = async (keypath, certpath) => ({
  key: await fsp.readFile(keypath),
  cert: await fsp.readFile(certpath),
});

const main = async () => {
  const options = await tlsOptions(keypath, certpath);
  const { port } = await loadEnv(envpath);
  const storage = await new Storage(sessionspath);
  const controllers = staticControllers(storage);
  staticServer(options, port, staticpath, controllers);
};

main();
