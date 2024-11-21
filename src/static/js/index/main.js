'use strict';

import setResizing from './resizing.js';
import api from '../api.js';
import Chat from './Chat.js';

const searchInput = document.getElementById('search-input');
const chatList = document.getElementById('chat-list');

searchInput.addEventListener('input', async (event) => {
  const { value } = searchInput;
  chatList.innerHTML = '';
  if (value.length === 0) return;
  const options = { username: value, firstName: value, secondName: value };
  const { users } = await api.users.read(options);
  for (const user of users) {
    const chat = new Chat(user);
    chatList.appendChild(chat.html());
  }
});

// import Chat from './Chat.js';

// const getChats = async () => {
//   const response = await fetch('chats.json');
//   const json = await response.json();
//   return json;
// };

const main = async () => {
  setResizing();
  // const data = await getChats();
  // for (const item of data) {
  //   const chat = new Chat(item);
  //   chat.generate();
  //   chat.onMessage((message) => {
  //     setTimeout(() => {
  //       chat.addMessage('My answer is: ' + message);
  //     }, 3000);
  //   });
  // }
};

main();
