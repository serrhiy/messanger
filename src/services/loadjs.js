'use strict';

const load = require('./load.js');
const routing = require('./staticRouting.js');
const buildRoutes = require('./buildRoutes.js');

module.exports = async (path, sandbox) => {
  const controllers = await routing('.js')(path);
  const routes = await buildRoutes(controllers, (file) => load(file, sandbox));
  return routes;
};
