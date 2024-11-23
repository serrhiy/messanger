'use strict';

const load = require('../load.js');
const http2 = require('node:http2');
const getCookie = require('./getCookie.js');
const routing = require('../staticRouting.js');
const prepareUrl = require('../prepareUrl.js');
const buildRoutes = require('../buildRoutes.js');

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

const sandbox = {
  console,
  db: require('../db.js'),
  common: {
    ...require('../hash.js'),
    generateToken: require('../generateToken.js'),
  },
};

const defaultCookie = (cookie) => ({
  'content-type': 'application/json',
  'access-control-allow-origin': 'https://localhost:8000',
  'access-control-allow-credentials': true,
  ...cookie,
});

module.exports = async (options, port, apipath) => {
  const server = http2.createSecureServer(options);
  const table = await routing('.js')(apipath);
  const controllers = await buildRoutes(table, (file) => load(file, sandbox));
  server.on('stream', async (stream, headers) => {
    const url = prepareUrl(headers[':path']);
    console.log(headers['origin']);
    if (!controllers.has(url)) {
      stream.respond(defaultCookie({ ':status': 404 }));
      const answer = { success: false, message: 'Invalid url' };
      return void stream.end(JSON.stringify(answer));
    }
    const controller = controllers.get(url);
    const body = await parseBody(stream);
    console.log({ body });
    if (!body || !body.type || !controller[body.type]) {
      stream.respond(defaultCookie({ ':status': 404 }));
      const answer = { success: false, message: 'Invalid body' };
      return void stream.end(JSON.stringify(answer));
    }
    const cookies = [];
    const { data, type } = body;
    const cookie = getCookie(cookies, headers.cookie);
    const answer = await controller[type](data, cookie);
    stream.respond(defaultCookie({ 'set-cookie': cookies, ':status': 200 }));
    stream.end(JSON.stringify(answer));
  });
  server.listen(port);
};
