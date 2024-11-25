'use strict';

const path = require('node:path');

module.exports = (table, exts, mainFile = 'index') => {
  const result = new Map();
  for (const [relative, fullpath] of table) {
    const extention = path.extname(relative);
    if (exts.includes(extention)) {
      const { dir, name } = path.parse(relative);
      const filename = name === mainFile ? '' : path.join(dir, name);
      result.set(filename, fullpath);
      continue;
    }
    result.set(relative, fullpath);
  }
  return result;
};
