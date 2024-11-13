'use strict';

const fsp = require('node:fs/promises');

module.exports = async (envPath) => {
  const content = await fsp.readFile(envPath, 'utf-8');
  const lines = content.split('\n');
  const result = Object.create(null);
  for (const line of lines) {
    const [key, value] = line.split('=');
    result[key] = value;
  }
  return result;
};
