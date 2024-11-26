'use strict';

const http = (host) => async (path, data) => {
  const url = host + path;
  const body = JSON.stringify(data);
  const options = { method: 'post', credentials: 'include', body };
  const response = await fetch(url, options);
  const json = await response.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

const ws = (host, eventTarget) => {
  const ws = new WebSocket(host);
  ws.addEventListener('message', (event) => {
    const { data: response } = event;
    const json = JSON.parse(response);
    if (!json.success) throw new Error(json.message);
    const data = new CustomEvent('message', { detail: json.data });
    eventTarget.dispatchEvent(data);
  });
  return (path, data) => {
    const body = JSON.stringify(data);
    ws.send(body);
  };
};

export default { http, ws };
