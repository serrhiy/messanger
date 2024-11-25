'use strict';

export default (transport) =>
  (structure, url = '/') => {
    const api = Object.create(null);
    for (const [key, services] of Object.entries(structure)) {
      const path = url + key + '/';
      if (!Array.isArray(services)) {
        api[key] = scaffold(services, path);
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
