'use strict';

const path = require('node:path');
const fsp = require('node:fs/promises');
const loadEnv = require('./loadEnv.js');
const parseCookie = require('./parseCookie.js');
const staticServer = require('./services/static');
const Storage = require('./storage/fileStorage.js');
const load = require('./load.js');
const routing = require('./staticRouting.js');
const buildRoutes = require('./buildRoutes.js');

const envpath = path.join(__dirname, '.env');
const staticpath = path.join(__dirname, 'static');
const keypath = path.join(__dirname, 'cert/key.pem');
const sessionspath = path.join(__dirname, 'sessions');
const certpath = path.join(__dirname, 'cert/cert.pem');
const controllerspath = path.join(__dirname, 'controllers');

const tlsOptions = async (keypath, certpath) => ({
  key: await fsp.readFile(keypath),
  cert: await fsp.readFile(certpath),
});

const main = async () => {
  const sandbox = {
    storage: await new Storage(sessionspath),
    parseCookie,
    redirect: (location, status) => ({ status, location }),
    render: (location, status) => ({ status, location }),
  };
  const options = await tlsOptions(keypath, certpath);
  const { port } = await loadEnv(envpath);
  const controllers = await routing('.js')(controllerspath);
  const routes = await buildRoutes(controllers, (path) => load(path, sandbox));
  staticServer(options, port, staticpath, routes);
};

main();
