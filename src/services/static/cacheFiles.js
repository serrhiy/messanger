'use strict';

const fs = require('node:fs');
const zlib = require('node:zlib');

const zip = (...iterables) => ({
  [Symbol.iterator]: () => {
    const iterators = [];
    for (const iterable of iterables) {
      if (Symbol.iterator in iterable) {
        iterators.push(iterable[Symbol.iterator]());
        continue;
      }
      throw new Error(`Object ${iterable} is not iterable`);
    }
    const next = () => {
      const values = [];
      for (const iterator of iterators) {
        const result = iterator.next();
        if (result.done) return { done: true, value: null };
        values.push(result.value);
      }
      return { done: false, value: values };
    };
    return { next };
  },
});

const cacheFile = async (filepath) => {
  const readale = fs.createReadStream(filepath);
  const transform = zlib.createGzip();
  readale.pipe(transform);
  const chunks = [];
  for await (const chunk of transform) chunks.push(chunk);
  return Buffer.concat(chunks);
};

module.exports = async (routes) => {
  const result = new Map();
  const values = Array.from(routes.values());
  const promises = values.map(cacheFile);
  const errors = [];
  const files = await Promise.allSettled(promises);
  for (const [key, file] of zip(routes.keys(), files)) {
    const { status, value, reason } = file;
    if (status === 'fulfilled') result.set(key, value);
    else errors.push(reason);
  }
  if (errors.length > 0) throw new AggregateError(errors);
  return result;
};
