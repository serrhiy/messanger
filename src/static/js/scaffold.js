'use strict';

const scaffold = (structure, transport, url = '') => {
  const api = Object.create(null);
  for (const [key, services] of Object.entries(structure)) {
    const path = url + key + '/';
    if (!Array.isArray(services)) {
      api[key] = scaffold(services, transport, path);
      continue;
    }
    const functions = Object.create(null);
    for (const service of services) {
      functions[service] = async (data) => {
        const send = { data, service };
        return await transport(path, send);
      };
    }
    api[key] = functions;
  }
  return api;
};

export default (endpoints, transports) => {
  const api = new EventTarget();
  for (const endpoint of endpoints) {
    const { structure, host } = endpoint;
    const transport = transports[endpoint.transport];
    const subApi = scaffold(structure, transport(host, api));
    Object.assign(api, subApi);
  }
  return api;
};
