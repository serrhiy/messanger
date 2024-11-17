'use strict';

module.exports = (string) => {
  const result = {};
  if (!string) return result;
  const cookies = string.split(';');
  for (const cookie of cookies) {
    const [key, value = ''] = cookie.split('=');
    result[key.trim()] = value.trim();
  }
  return result;
};
