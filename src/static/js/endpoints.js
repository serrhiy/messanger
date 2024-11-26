'use strict';

export default [
  {
    structure: {
      users: ['create', 'login', 'read', 'me'],
      chats: ['create', 'read', 'participants'],
    },
    host: 'https://127.0.0.1:8080/',
    transport: 'http',
  },
  {
    structure: {
      messages: ['create']
    },
    host: 'https://127.0.0.1:8088/',
    transport: 'ws',
  }
];
