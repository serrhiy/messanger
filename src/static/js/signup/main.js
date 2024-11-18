'use strict';

const api = 'https://127.0.0.1:8080/users';

const form = document.getElementById('form');
const username = document.getElementById('username');
const firstName = document.getElementById('firstName');
const secondName = document.getElementById('secondName');
const password1 = document.getElementById('password1');
const password2 = document.getElementById('password2');

const inputs = [username, firstName, secondName, password1, password2];

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = {
    username: username.value,
    firstName: firstName.value,
    secondName: secondName.value,
    password: password1.value
  };
  for (const input of inputs) input.value = '';
  fetch(api, { method: 'post', body: JSON.stringify(result) });
});
