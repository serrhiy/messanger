'use strict';

const http2 = require('node:http2');
const getCookie = require('./getCookie.js');
const prepareUrl = require('../prepareUrl.js');

const isDataValid = (data, structure) => {
  for (const [field, { mandatory, validators }] of Object.entries(structure)) {
    const exists = field in data;
    if (!exists) {
      if (mandatory) return false;
      continue;
    }
    const value = data[field];
    for (const validator of validators) {
      if (!validator(value)) return false;
    }
  }
  return true;
};

const getBody = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : null;
};

const parseBody = async (stream) => {
  try {
    const body = await getBody(stream);
    return JSON.parse(body.toString());
  } catch {
    return null;
  }
};

const defaultHeaders = (cookie, origin = 'null') => ({
  'content-type': 'application/json',
  'access-control-allow-origin': origin,
  'access-control-allow-credentials': true,
  ...cookie,
});

module.exports = async (options, port, controllers, validator) => {
  const server = http2.createSecureServer(options);
  server.on('stream', async (stream, headers) => {
    const url = prepareUrl(headers[':path']);
    const { origin } = headers;
    if (!controllers.has(url)) {
      stream.respond(defaultHeaders({ ':status': 404 }, origin));
      const answer = { success: false, message: 'Invalid url' };
      return void stream.end(JSON.stringify(answer));
    }
    const services = controllers.get(url);
    const body = await parseBody(stream);
    const validStructure = body !== null && body.service in services;
    if (!validStructure) {
      stream.respond(defaultHeaders({ ':status': 400 }, origin));
      const answer = { success: false, message: 'Invalid body' };
      return void stream.end(JSON.stringify(answer));
    }
    const serivce = services[body.service];
    const { controller, structure, needToken } = serivce;
    if (!isDataValid(body.data, structure)) {
      stream.respond(defaultHeaders({ ':status': 400 }, origin));
      const answer = { success: false, message: 'Invalid structure' };
      return void stream.end(JSON.stringify(answer));
    }
    const cookies = [];
    const cookie = getCookie(cookies, headers.cookie);
    const success = await validator({ needToken }, cookie);
    if (!success) {
      stream.respond(defaultHeaders({ ':status': 401 }, origin));
      const answer = { success: false, message: 'Invalid token' };
      return void stream.end(JSON.stringify(answer));
    }
    const answer = await controller.call(serivce, body.data, cookie);
    const responseHeaders = { 'set-cookie': cookies, ':status': 200 };
    stream.respond(defaultHeaders(responseHeaders, origin));
    stream.end(JSON.stringify(answer));
  });
  server.listen(port);
};
