'use strict';

const api = 'https://127.0.0.1:8080/users';

const username = document.getElementById('username');
const password = document.getElementById('password');
const form = document.getElementById('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = {
    username: username.value,
    password: password.value,
  };
  username.value = '';
  password.value = '';
  const body = JSON.stringify({ data, type: 'login' });
  const options = { method: 'post', credentials: 'include', body };
  const response = await fetch(api, options);
  const json = await response.json();
  console.log({ json });
  if (json.success) location.reload();
});
