'use strict';

import setResizing from './resizing.js';
import Chat from './Chat.js';

const getChats = async () => {
  const response = await fetch('./chats.json');
  const json = await response.json();
  return json;
};

const main = async () => {
  setResizing();
  const data = await getChats();
  for (const item of data) {
    const chat = new Chat(item);
    chat.generate();
    chat.onMessage((message) => {
      setTimeout(() => {
        chat.addMessage('My answer is: ' + message);
      }, 3000);
    });
  }
};

main();
