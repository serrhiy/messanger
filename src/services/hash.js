'use strict';

const crypto = require('node:crypto');
const util = require('node:util');

const randomBytes = util.promisify(crypto.randomBytes);
const scrypt = util.promisify(crypto.scrypt);

const SCRYPT_PARAMS = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const SCRYPT_PREFIX = '$scrypt$N=32768,r=8,p=1,maxmem=67108864$';

const SALT_LEN = 32;
const KEY_LEN = 64;

const parseOptions = (options) => {
  const values = [];
  const items = options.split(',');
  for (const item of items) {
    const [key, val] = item.split('=');
    values.push([key, Number(val)]);
  }
  return Object.fromEntries(values);
};

const deserializeHash = (phcString) => {
  const [, name, options, salt64, hash64] = phcString.split('$');
  if (name !== 'scrypt') {
    throw new Error('Node.js crypto module only supports scrypt');
  }
  const params = parseOptions(options);
  const salt = Buffer.from(salt64, 'base64');
  const hash = Buffer.from(hash64, 'base64');
  return { params, salt, hash };
};

const hashPassword = async (password) => {
  const salt = await randomBytes(SALT_LEN);
  const hash = await scrypt(password, salt, KEY_LEN, SCRYPT_PARAMS);
  const saltString = salt.toString('base64').split('=')[0];
  const hashString = hash.toString('base64').split('=')[0];
  return `${SCRYPT_PREFIX}${saltString}$${hashString}`;
};

const validatePassword = async (password, serHash) => {
  const { params, salt, hash } = deserializeHash(serHash);
  const hashedPassword = await scrypt(password, salt, hash.length, params);
  return crypto.timingSafeEqual(hashedPassword, hash);
};

module.exports = { hashPassword, validatePassword };
