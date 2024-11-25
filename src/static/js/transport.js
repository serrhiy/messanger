'use strict';

export default async (url, data) => {
  const serialised = JSON.stringify(data);
  const options = { method: 'post', credentials: 'include', body: serialised };
  const response = await fetch(url, options);
  const json = await response.json();
  return json;
};
