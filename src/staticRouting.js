'use strict';

const path = require('node:path');
const fsp = require('node:fs/promises');

module.exports = (extention, rootFileName = 'index') => {
  const prepareKey = (filepath) => {
    const { dir, name, ext } = path.parse(filepath);
    if (ext !== extention) return filepath;
    const indexed = name === rootFileName ? '' : name;    
    const url = path.join(dir, indexed);
    return url === '.' ? '' : url;
  };

  const staticRouting = async (root, parent = '', routing = new Map()) => {
    const files = await fsp.readdir(root, { withFileTypes: true });
    for (const file of files) {
      const { name: filename } = file;
      const relativePath = path.join(parent, filename);
      const fullpath = path.join(root, filename);
      if (file.isDirectory()) {
        await staticRouting(fullpath, relativePath, routing);
        continue;
      }
      if (!file.isFile()) continue;
      const key = prepareKey(relativePath);
      routing.set(key, fullpath);
    }
    return routing;
  };

  return staticRouting;
};
