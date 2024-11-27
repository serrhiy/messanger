'use strict';

export default async (url, data) => {
  const body = JSON.stringify(data);
  const options = { method: 'post', credentials: 'include', body };
  const response = await fetch(url, options);
  const json = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};
