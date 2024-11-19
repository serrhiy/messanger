'use strict';

const http2 = require('node:http2');
const loadjs = require('../loadjs.js');
const prepareUrl = require('../prepareUrl.js');
const db = require('../db.js');

const ALLOWED_DOMAIN = '127.0.0.1';

const getBody = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
};

const crud = { get: 'read', post: 'create', put: 'update', delete: 'delete' };

module.exports = async (options, port, apipath) => {
  const server = http2.createSecureServer(options);
  const controllers = await loadjs(apipath, { db, console });
  server.on('stream', async (stream, header) => {
    const url = prepareUrl(header[':path']);
    const method = header[':method'].toLowerCase();
    const type = crud[method];
    const { origin = '' } = header;
    const respondHeader = { 'content-type': 'application/json' };
    if (origin.includes(ALLOWED_DOMAIN)) {
      respondHeader['access-control-allow-origin'] = origin;
    }
    const controller = controllers.get(url);
    const exists = controller && type in controller;
    if (exists) {
      const body = await getBody(stream);
      const data = JSON.parse(body.toString());
      console.log({ data });
      const answer = await controller[type](data);
      respondHeader[':status'] = 200;
      stream.respond(respondHeader);
      return void stream.end(answer);
    }
    respondHeader[':status'] = 404;
    stream.respond(respondHeader);
    stream.end('Not found');
  });
  server.listen(port);
};
