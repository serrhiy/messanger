'use strict';

const path = require('node:path');
const fsp = require('node:fs/promises');

const resolvePaths = async (root, parent = '') => {
  const routing = new Map();
  const files = await fsp.readdir(root, { withFileTypes: true });
  for (const file of files) {
    const { name: filename } = file;
    const relativePath = path.join(parent, filename);
    const fullpath = path.join(root, filename);
    if (file.isDirectory()) {
      const subrouting = await resolvePaths(fullpath, relativePath);
      for (const [key, value] of subrouting) routing.set(key, value);
      continue;
    }
    const name = path.join(parent, filename);
    routing.set(name, fullpath);
  }
  return routing;
};

module.exports = resolvePaths;
