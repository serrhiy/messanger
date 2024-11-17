'use strict';

const fs = require('node:fs');
const zlib = require('node:zlib');

module.exports = async (filepath) => {
  const readale = fs.createReadStream(filepath);
  const transform = zlib.createGzip();
  readale.pipe(transform);
  const chunks = [];
  for await (const chunk of transform) chunks.push(chunk);
  return Buffer.concat(chunks);
};
