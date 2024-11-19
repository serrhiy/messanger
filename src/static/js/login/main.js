'use strict';

const api = 'https://127.0.0.1:8080/login';

const username = document.getElementById('username');
const password = document.getElementById('password');
const form = document.getElementById('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const result = {
    username: username.value,
    password: password.value,
  };
  username.value = '';
  password.value = '';
  const body = JSON.stringify(result);
  const options = { method: 'post', credentials: 'include', body };
  const response = await fetch(api, options);
  console.log(response);
  
  const json = await response.json();
  console.log({ json });
});
