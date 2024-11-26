'use strict';

const chatList = document.getElementById('chat-list');

class Chats extends Array {

  constructor(...args) {
    super(...args);
  }

  draw() {
    this.sort((a, b) => a.createdAt - b.createdAt);
    chatList.innerHTML = '';
    const html = this.map((chat) => chat.html());
    chatList.append(...html);
  }
}

export default new Chats();
