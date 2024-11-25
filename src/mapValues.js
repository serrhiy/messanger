'use strict';

const zip = (...iterables) => ({
  [Symbol.iterator]: () => {
    const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());
    const next = () => {
      const values = [];
      for (const iterator of iterators) {
        const { done = false, value } = iterator.next();
        if (done) return { done: true, value: null };
        values.push(value);
      }
      return { done: false, value: values };
    };
    return { next };
  },
});

module.exports = async (routing, loader) => {
  const promises = Array.from(routing.values()).map(loader);
  const errors = [];
  const files = await Promise.allSettled(promises);
  const result = new Map();
  for (const [url, { status, value, reason }] of zip(routing.keys(), files)) {
    if (status === 'fulfilled') result.set(url, value);
    else errors.push(reason);
  }
  if (errors.length > 0) throw new AggregateError(errors);
  return result;
};
