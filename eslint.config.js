'use strict';

const init = require('eslint-config-metarhia');

module.exports = [
  {
    files: ['./'],
    rules: init,
  },
  {
    files: ['src/static'],
    rules: {
      ...init,
      sourceType: 'module',
    },
  },
];
