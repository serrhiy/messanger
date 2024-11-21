'use strict';

import api from "../api.js";

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
  console.log({ data });
  const answer = await api.users.login(data);
  console.log({ answer });
  if (answer.success) location.reload();
});
