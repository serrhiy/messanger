'use strict';

const http2 = require('node:http2');
const cacheFile = require('./cacheFile.js');
const contentType = require('./contentType.js');
const routing = require('../../staticRouting.js');
const builtRoutes = require('../../buildRoutes.js');

const prepareUrl = (url) => {
  const sliced = url.startsWith('/') ? url.slice(1) : url;
  return sliced.endsWith('/') ? sliced.slice(0, sliced.length - 1) : sliced;
};

module.exports = async (options, port, staticFolder, controllers) => {
  const table = await routing(null, null)(staticFolder);
  const routes = await builtRoutes(table, cacheFile);
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
      'content-type': types.get(buffer),
      'content-encoding': 'gzip',
      ':status': 200,
    });
    stream.end(buffer);
  });
  server.listen(port);
};
