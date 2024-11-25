'use strict';

const parseCookie = require('../parseCookie.js');

const MAX_AGE = 30 * 24 * 60 * 60;
const DEFAULT_COOKIE = `Max-Age=${MAX_AGE}; Path=/; Secure; HttpOnly`;

module.exports = (cookies, rawCookie) => {
  const cookie = parseCookie(rawCookie);
  return {
    set: (key, value) =>
      void cookies.push(`${key}=${value}; ${DEFAULT_COOKIE}`),
    get: (key) => cookie[key],
    delete: (key) => void cookies.push(`${key}=${value}; Max-Age=0`),
    has: (key) => key in cookie,
  };
};
