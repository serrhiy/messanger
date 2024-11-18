'use strict';

const fsp = require('node:fs/promises');
const vm = require('node:vm');

const RUN_OPTIONS = { timeout: 5000, displayErrors: false };

module.exports = async (filename, sandbox) => {
  const code = await fsp.readFile(filename);
  const source = `'use strict';${code}`;
  const script = new vm.Script(source);
  const context = vm.createContext(Object.freeze({ ...sandbox }));
  const exported = script.runInContext(context, RUN_OPTIONS);
  return exported;
};
