'use strict';

class Storage {
  get(key) {
    throw new Error("'get' method must be implemented");
  }

  set(key, value) {
    throw new Error("'set' method must be implemented");
  }

  has(key) {
    throw new Error("'has' method must be implemented");
  }

  delete(key) {
    throw new Error("'delete' method must be implemented");
  }
}

module.exports = Storage;
