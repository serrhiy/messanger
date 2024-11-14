'use strict';

const parseCookie = (string) => {
  const result = {};
  if (!string) return result;
  const cookies = string.split(';');
  for (const cookie of cookies) {
    const [key, value = ''] = cookie.split('=');
    result[key.trim()] = value.trim();
  }
  return result;
};

const redirect = (status, location) => ({ redirect: true, status, location });

const noredirect = () => ({ redirect: false });

module.exports = (storage) => ({
  '': async (headers) => {
    const cookie = parseCookie(headers.cookie);
    const { token } = cookie;
    if (!token || !(await storage.has(token))) return redirect(302, 'login');
    return noredirect();
  },
  login: async (headers) => {
    const cookie = parseCookie(headers.cookie);
    const { token } = cookie;
    if (await storage.has(token)) return redirect(303, '');
    return noredirect();
  },
});
