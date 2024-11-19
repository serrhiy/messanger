'use strict';

const db = require('./services/db.js');
const parseCookie = require('./services/parseCookie.js');

const sessions = db('sessions');

module.exports = async (url, headers) => {
  const cookie = parseCookie(headers.cookie);
  const { token } = cookie;
  if (token) {
    const exists = await sessions.exists({ token });
    if (exists) {
      if (url !== '') return { success: false, path: '/' };
      return { success: true };
    }
  }
  if (url !== '') return { success: true };
  return { success: false, path: 'login' };
};
