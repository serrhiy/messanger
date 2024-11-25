'use strict';

module.exports = (db) => {
  const users = db('users');
  return async (handler, cookie) => {
    if (!handler.needToken) return true;
    if (!cookie.has('token')) return false;
    const token = cookie.get('token');
    const exists = await users.exists({ token });
    return exists ? true : false;
  };
};
