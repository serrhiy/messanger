'use strict';

const db = require('./db.js');
const parseCookie = require('./services/parseCookie.js');

const users = db('users');

module.exports = async (url, headers) => {
  const cookie = parseCookie(headers.cookie);
  const { token } = cookie;
  if (token) {
    const exists = await users.exists({ token });
    if (exists) {
      if (url !== '') return { success: false, path: '/' };
      return { success: true };
    }
  }
  if (url !== '') return { success: true };
  return { success: false, path: 'login' };
};
