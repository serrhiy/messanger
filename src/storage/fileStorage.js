'use strict';

const v8 = require('node:v8');
const path = require('node:path');
const Storage = require('./storage.js');
const fsp = require('node:fs/promises');

const toBool = [() => true, () => false];

const exists = (file) => fsp.access(file).then(...toBool);

class FileStorage extends Storage {
  #cache = new Map();
  #dirpath = '';

  constructor(dirpath) {
    super();
    this.#dirpath = dirpath;
    return this.#prepareStorage().then(() => this);
  }

  async #prepareStorage() {
    const dirpath = this.#dirpath;
    const dirExists = await exists(dirpath);
    if (!dirExists) {
      return void (await fsp.mkdir(dirpath, { recursive: true }));
    }
    const files = await fsp.readdir(dirpath);
    for (const file of files) {
      const fullpath = path.join(dirpath, file);
      const serialised = await fsp.readFile(fullpath);
      const content = v8.deserialize(serialised);
      this.#cache.set(file, content);
    }
  }

  has(filepath) {
    return this.#cache.has(filepath);
  }

  get(filepath) {
    return this.#cache.get(filepath);
  }

  async set(filepath, value) {
    const fullpath = path.join(this.#dirpath, filepath);
    const serialised = v8.serialize(value);
    await fsp.writeFile(fullpath, serialised);
    this.#cache.set(filepath, value);
    return this;
  }

  async delete(filepath) {
    if (!this.has(filepath)) return false;
    const fullpath = path.join(this.#dirpath, filepath);
    await fsp.rm(fullpath);
    this.#cache.delete(filepath);
    return true;
  }
}

module.exports = FileStorage;
