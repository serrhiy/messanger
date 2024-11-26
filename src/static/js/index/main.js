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
  if (value.length === 0) return void chats.draw();
  const options = { username: value, firstName: value, secondName: value };
  const users = await api.users.read(options);
  for (const user of users) {
    const hasChat = chats.findIndex((chat) => (
      chat.data.isDialog && chat.data.user.id === user.id
    ));
    if (user.id === me.id || hasChat !== -1) continue;
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
  const rawChats = await api.chats.read({ userId: me.id });
  for (const rawChat of rawChats) {
    const { id: chatId, isDialog, createdAt } = rawChat;
    if (!isDialog) continue;
    const participants = await api.chats.participants({ id: chatId });
    const [participant] = participants.filter((user) => user.id !== me.id);
    const { firstName, secondName, avatar, username, id } = participant;
    const name = firstName + ' ' + secondName;
    const chat = new Chat({ name, avatar, createdAt, chatId, isDialog, user: participant });
    chats.push(chat);
  }
  chats.draw();
  searchInput.addEventListener('input', onSerach(me));
};

main();
