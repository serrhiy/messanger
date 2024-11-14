'use strict';

const http2 = require('node:http2');
const routing = require('./routing.js');
const cacheFiles = require('./cacheFiles.js');
const contentType = require('./contentType.js');

const prepareUrl = (url) => {
  const sliced = url.startsWith('/') ? url.slice(1) : url;
  return sliced.endsWith('/') ? sliced.slice(0, sliced.length - 1) : sliced;
};

module.exports = async (options, port, staticFolder, controllers) => {
  const table = await routing(staticFolder);
  const routes = await cacheFiles(table);
  const types = contentType(table);
  const server = http2.createSecureServer(options);
  const notFound = routes.get('404');
  server.on('stream', async (stream, headers) => {
    const url = prepareUrl(headers[':path']);
    if (url in controllers) {
      const response = await controllers[url](headers);
      if (response.redirect) {
        const { status, location } = response;
        stream.respond({ ':status': status, location });
        return void stream.end();
      }
    }
    const exists = routes.has(url);
    const buffer = exists ? routes.get(url) : notFound;
    const type = types.get(url);
    stream.respond({
      'content-type': type,
      'content-encoding': 'gzip',
      ':status': exists ? 200 : 404,
    });
    stream.end(buffer);
  });
  server.listen(port);
};
