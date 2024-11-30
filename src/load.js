'use strict';

const fsp = require('node:fs/promises');
const vm = require('node:vm');

module.exports = (options) => (sandbox) => async (filename) => {
  const code = await fsp.readFile(filename);
  const source = `'use strict';${code}`;
  const script = new vm.Script(source);
  const context = vm.createContext(Object.freeze({ ...sandbox }));
  const exported = script.runInContext(context, options);
  return exported;
};
