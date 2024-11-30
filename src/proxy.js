'use strict';

const parseCookie = require('./services/parseCookie.js');

module.exports = (db) => async (url, headers) => {
  const cookie = parseCookie(headers.cookie);
  const { token } = cookie;
  if (token) {
    const exists = await db('users').where({ token }).first();
    if (exists) {
      if (url !== '') return { success: false, path: '/' };
      return { success: true };
    }
  }
  if (url !== '') return { success: true };
  return { success: false, path: 'login' };
};
