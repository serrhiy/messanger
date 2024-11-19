'use strict';

const api = 'https://127.0.0.1:8080/signup';

const form = document.getElementById('form');
const username = document.getElementById('username');
const firstName = document.getElementById('firstName');
const secondName = document.getElementById('secondName');
const password1 = document.getElementById('password1');
const password2 = document.getElementById('password2');

const inputs = [username, firstName, secondName, password1, password2];

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const result = {
    username: username.value,
    firstName: firstName.value,
    secondName: secondName.value,
    password: password1.value,
  };
  for (const input of inputs) input.value = '';
  const body = JSON.stringify(result);
  const options = { method: 'post', credentials: 'include', body };
  const response = await fetch(api, options);
  const json = await response.json();
  if (json.success) location.reload();
});
