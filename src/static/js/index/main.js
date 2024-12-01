'use strict';

import setResizing from './resizing.js';
import api from '../api.js';
import Chat from './Chat.js';
import chats from './Chats.js';

const searchInput = document.getElementById('search-input');
const chatList = document.getElementById('chat-list');

const onMessage = (me) => async (event) => {
  const { detail: message, target: chat } = event;
  const { chatId } = chat.data;
  const { id: userId } = me;
  const data = { message, chatId, userId };
  await api.messages.create(data);
  await api.chats.updateOnline({ chatId });
};

const onChatClick = async (event) => {
  const { target: chat } = event;
  await api.chats.updateOnline({ chatId: chat.data.chatId });
};

const onSerach = (me) => async () => {
  const { value } = searchInput;
  chatList.innerHTML = '';
  if (value.length === 0) return void chats.draw();
  const options = { username: value, firstName: value, secondName: value };
  const users = await api.users.read(options);
  for (const user of users) {
    const hasChat = chats.findIndex(
      (chat) => chat.data.isDialog && chat.data.user.id === user.id,
    );
    if (user.id === me.id || hasChat !== -1) continue;
    const { firstName, secondName, avatar } = user;
    const name = firstName + ' ' + secondName;
    const chat = new Chat({ name, avatar }, me);
    chat.addEventListener(
      'click',
      async () => {
        const response = await api.chats.create({ users: [user.id] });
        const { createdAt: created, id: chatId, isDialog } = response;
        const createdAt = new Date(created);
        const options = { name, chatId, avatar, createdAt, isDialog, user };
        chat.data = options;
        chat.addEventListener('message', onMessage(me));
        chat.addEventListener('click', onChatClick);
        chats.push(chat);
        chats.draw();
        searchInput.value = '';
      },
      { once: true },
    );
    chat.generate();
  }
};

const main = async () => {
  setResizing();
  const me = await api.users.me();
  const ws = new WebSocket('https://127.0.0.1:8088/');
  ws.addEventListener('message', async (event) => {
    const { type, data } = JSON.parse(event.data);
    if (type === 'message') {
      const { chatId, message } = data;
      const chat = chats.find((chat) => chat.data.chatId === chatId);
      chat.addMessage(message);
      if (chat.isActive()) {
        await api.chats.updateOnline({ chatId });
      }
    } else if (type === 'chat') {
      if (!data.isDialog) return;
      const name = data.user.firstName + ' ' + data.user.secondName;
      const { avatar } = data.user;
      const { id: chatId } = data;
      const chat = new Chat({ ...data, avatar, name, chatId }, me);
      chat.addEventListener('message', onMessage(me));
      chat.addEventListener('click', onChatClick);
      chats.push(chat);
      chats.draw();
    }
  });
  await api.users.updateOnline();
  const rawChats = await api.chats.read({ userId: me.id });
  for (const rawChat of rawChats) {
    const { id: chatId, isDialog, lastTimeInChat } = rawChat;
    const createdAt = new Date(rawChat.createdAt);
    const rawMessages = await api.messages.read({ chatId });
    const messages = rawMessages.map((message) => ({
      ...message,
      createdAt: new Date(message.createdAt),
    }));
    if (!isDialog) continue;
    const participants = await api.chats.participants({ id: chatId });
    const [user] = participants.filter((user) => user.id !== me.id);
    const { firstName, secondName, avatar, lastOnline } = user;
    const name = firstName + ' ' + secondName;
    const data = {
      name,
      avatar,
      createdAt,
      messages,
      chatId,
      isDialog,
      user,
      lastTimeInChat,
      lastOnline,
    };
    const chat = new Chat(data, me);
    chat.addEventListener('message', onMessage(me));
    chat.addEventListener('click', onChatClick);
    chats.push(chat);
  }
  chats.draw();
  searchInput.addEventListener('input', onSerach(me));
};

main();
