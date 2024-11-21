'use strict';

import api from '../api.js';

const form = document.getElementById('form');
const username = document.getElementById('username');
const firstName = document.getElementById('firstName');
const secondName = document.getElementById('secondName');
const password1 = document.getElementById('password1');
const password2 = document.getElementById('password2');

const inputs = [username, firstName, secondName, password1, password2];

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = {
    username: username.value,
    firstName: firstName.value,
    secondName: secondName.value,
    password: password1.value,
  };
  for (const input of inputs) input.value = '';
  const answer = await api.users.create(data);
  if (answer.success) location.reload();
});
