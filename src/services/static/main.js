'use strict';

const path = require('node:path');
const loadjs = require('../loadjs.js');
const http2 = require('node:http2');
const cacheFile = require('./cacheFile.js');
const prepareUrl = require('../prepareUrl.js');
const routing = require('../staticRouting.js');
const contentType = require('./contentType.js');
const buildRoutes = require('../buildRoutes.js');
const parseCookie = require('../parseCookie.js');
const Storage = require('../storage/fileStorage.js');

const sessionspath = path.join(__dirname, 'sessions');

module.exports = async (options, port, staticFolder, controllerspath) => {
  const sandbox = {
    storage: await new Storage(sessionspath),
    parseCookie: parseCookie,
    redirect: (location, status) => ({ status, location }),
    render: (location, status) => ({ status, location }),
  };
  const controllers = await loadjs(controllerspath, sandbox);
  const table = await routing(null, null)(staticFolder);
  const routes = await buildRoutes(table, cacheFile);
  const types = contentType(table);
  const server = http2.createSecureServer(options);
  const notFound = routes.get('404.html');
  server.on('stream', async (stream, headers) => {
    const url = prepareUrl(headers[':path']);
    const exists = controllers.get(url);
    if (!exists) {
      const isStatic = routes.has(url);
      const found = isStatic && !url.endsWith('.html');
      const buffer = found ? routes.get(url) : notFound;
      const status = found ? 201 : 404;
      stream.respond({
        ':status': status,
        'content-type': types.get(buffer),
        'content-encoding': 'gzip',
      });
      return void stream.end(buffer);
    }
    const controller = controllers.get(url);
    const { status, location } = await controller(headers.cookie);
    if (status >= 300 && status < 400) {
      stream.respond({ location, ':status': status });
      return void stream.end();
    }
    const buffer = routes.get(location);
    stream.respond({
      ':status': 200,
      'content-type': types.get(buffer),
      'content-encoding': 'gzip',
    });
    stream.end(buffer);
  });
  server.listen(port);
};
