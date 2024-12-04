'use strict';

const chatList = document.getElementById('chat-list');

class Chats extends Array {
  constructor(...args) {
    super(...args);
  }

  draw() {
    this.sort((a, b) => b.chat.createdAt - a.chat.createdAt);
    chatList.innerHTML = '';
    for (const chat of this) chat.generate();
  }
}

export default new Chats();
