'use strict';

module.exports = async (routing, loader) => {
  const promises = Array.from(routing.values()).map(loader);
  const errors = [];
  const values = [];
  const files = await Promise.allSettled(promises);
  for (const file of files) {
    const { status, value, reason } = file;
    if (status === 'fulfilled') values.push(value);
    else errors.push(reason);
  }
  if (errors.length > 0) throw new AggregateError(errors);
  const keys = Array.from(routing.keys());
  const entries = values.map((value, index) => [keys[index], value]);
  return new Map(entries);
};