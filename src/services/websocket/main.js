'use strict';

const https = require('node:https');
const WebSocket = require('websocket');

module.exports = (options, port, controllers, validator) => {
  const server = https.createServer(options);
  const ws = new WebSocket(server, { port }, validator);
  ws.on('connection', (connection) => {
    console.log('connection!');
  });
};
