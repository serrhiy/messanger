'use strict';

const https = require('node:https');
const WebSocket = require('websocket');
const parseCookie = require('../parseCookie.js');

module.exports = (options, port, events, validator, db) => {
  const server = https.createServer(options);
  const ws = new WebSocket(server, { port }, validator);
  const connections = new Map();
  ws.on('connection', async (connection, headers) => {
    const { token } = parseCookie(headers.cookie);
    connections.set(token, connection);
    connection.on('disconnect', () => {
      connections.delete(token);
    });
  });
  events.on('message', async (message, usersToken) => {
    const users = await db('usersChats')
      .select('token')
      .join('users', { userId: 'id' })
      .where({ chatId: message.chatId })
      .whereNot({ token: usersToken });
    for (const user of users) {
      const { token } = user;
      if (!connections.has(token)) continue;
      const connection = connections.get(token);
      const json = JSON.stringify({ type: 'message', data: message });
      connection.write(json);
    }
  });
  events.on('chat', async (chat, usersToken) => {
    const users = await db('usersChats')
      .select('token')
      .join('users', { userId: 'id' })
      .where({ chatId: chat.id })
      .whereNot({ token: usersToken });
    for (const { token } of users) {
      if (!connections.has(token)) continue;
      const connection = connections.get(token);
      connection.write(JSON.stringify({ type: 'chat', data: chat }));
    }
  });
};
