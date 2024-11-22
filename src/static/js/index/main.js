'use strict';

import setResizing from './resizing.js';
import api from '../api.js';
import Chat from './Chat.js';

const searchInput = document.getElementById('search-input');
const chatList = document.getElementById('chat-list');

searchInput.addEventListener('input', async () => {
  const { value } = searchInput;
  chatList.innerHTML = '';
  if (value.length === 0) return;
  const options = { username: value, firstName: value, secondName: value };
  const { users } = await api.users.read(options);
  for (const user of users) {
    const chat = new Chat(user);
    chatList.appendChild(chat.html());
    chat.addEventListener('click', () => {
      
    });
  }
});

const main = async () => {
  setResizing();
};

main();
