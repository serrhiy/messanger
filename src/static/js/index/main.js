'use strict';

import setResizing from './resizing.js';
import api from '../api.js';
import Chat from './Chat.js';
import chats from './Chats.js';

const searchInput = document.getElementById('search-input');
const chatList = document.getElementById('chat-list');

const onSerach = (me) => async () => {
  const { value } = searchInput;
  chatList.innerHTML = '';
  if (value.length === 0) return;
  const options = { username: value, firstName: value, secondName: value };
  const users = await api.users.read(options);
  for (const user of users) {
    if (user.id === me.id) continue;
    const { firstName, secondName, avatar } = user;
    const name = `${firstName} ${secondName}`;
    const chat = new Chat({ name, avatar });
    chatList.appendChild(chat.html());
    chat.addEventListener('click', async () => {
      const data = { users: [me.id, user.id] };
      const response = await api.chats.create(data);
    });
  };
};

const main = async () => {
  setResizing();
  const me = await api.users.me();
  const rawChats = await api.chats.read({ userId: me.id })
  console.log({ rawChats });
  
  searchInput.addEventListener('input', onSerach(me));
};

main();
