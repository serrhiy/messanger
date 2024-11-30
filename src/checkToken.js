'use strict';

module.exports = (db) => async (handler, cookie) => {
  if (!handler.needToken) return true;
  if (!cookie.has('token')) return false;
  const token = cookie.get('token');
  const exists = await db('users').where({ token }).first();
  return exists ? true : false;
};
