'use strict';

const chatList = document.getElementById('chat-list');

class Chats {
  #chats = [];

  pushAll(chats) {
    this.#chats.concat(...chats);
    this.#chats.sort((a, b) => a.createdAt - b.createdAt);
    return this;
  }

  push(rawChat) {
    const chats = this.#chats;
    const createdAt = new Date(rawChat.createdAt);
    chats.push({ ...rawChat, createdAt });
    chats.sort((a, b) => a.raw.createdAt - b.raw.createdAt);
    return this;
  }

  draw() {
    chatList.innerHTML = '';
    const html = this.#chats.map((chat) => chat.html());
    chatList.append(...html);
  }
}

export default new Chats();