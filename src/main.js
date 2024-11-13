'use strict';

const path = require('node:path');
const http2 = require('node:http2');
const fsp = require('node:fs/promises');
const loadEnv = require('./loadEnv.js');

const envpath = path.resolve(__dirname, '.env');
const keypath = path.resolve(__dirname, 'cert/key.pem');
const certpath = path.resolve(__dirname, 'cert/cert.pem');

const tlsOptions = async (keypath, certpath) => ({
  key: await fsp.readFile(keypath),
  cert: await fsp.readFile(certpath)
});

const main = async () => {
  const options = await tlsOptions(keypath, certpath);
  const { port } = await loadEnv(envpath);
  const server = http2.createSecureServer(options);
  server.on('stream', (stream) => {
    stream.respond({ ':status': 200 });
    stream.end('success');
  });
  server.listen(port);
};

main();
