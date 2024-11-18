'use strict';

const crypto = require('node:crypto');

module.exports = (password) => new Promise((resolve, reject) => {
  const salt = crypto.randomBytes(16).toString('base64');
  crypto.scrypt(password, salt, 64, (error, key) => {
    if (error) reject(error);
    else resolve(salt + ':' + key.toString('base64'));
  });
});
