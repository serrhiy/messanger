'use strict';

const path = require('node:path');
const fsp = require('node:fs/promises');
const loadEnv = require('./loadEnv.js');
const staticServer = require('./services/static');
const WebSocket = require('websocket');
const https = require('node:https');

const envpath = path.join(__dirname, '.env');
const keypath = path.join(__dirname, 'cert/key.pem');
const certpath = path.join(__dirname, 'cert/cert.pem');
const staticpath = path.join(__dirname, 'static');

const tlsOptions = async (keypath, certpath) => ({
  key: await fsp.readFile(keypath),
  cert: await fsp.readFile(certpath),
});

const main = async () => {
  const options = await tlsOptions(keypath, certpath);
  const { port } = await loadEnv(envpath);
  staticServer(options, port, staticpath);
  const wsport = Number.parseInt(port) + 1;
  const ws = new WebSocket(new https.Server(options), { port: wsport });
  ws.on('connection', (connection) => {
    connection.setEncoding('utf8');
    connection.on('data', (message) => {
      console.log({ message });
    });
  });
};

main();
