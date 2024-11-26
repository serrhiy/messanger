'use strict';

const chatList = document.getElementById('chat-list');

class Chats extends Array {
  constructor(...args) {
    super(...args);
  }

  draw() {
    this.sort((a, b) => b.data.createdAt - a.data.createdAt);
    for (const chat of this) console.log(chat.data);
    chatList.innerHTML = '';
    for (const chat of this) chat.generate();
  }
}

export default new Chats();
