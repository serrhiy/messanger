'use strict';

import Dialog from './Dialog.js';

const chatList = document.getElementsByClassName('chat-list').item(0);

const buttom = document.querySelector('.dialog .buttom');
const top = document.querySelector('.dialog .top');

const buildNumber = (count) => {
  const number = document.createElement('div');
  Object.assign(number, { className: 'number' });
  number.appendChild(document.createTextNode(count));
  return number;
};

const buildChat = (user, avatar, text = '', date = '', unreadMessages = 0) => {
  const chat = document.createElement('div');
  const img = document.createElement('img');
  const info = document.createElement('div');
  Object.assign(chat, { className: 'chat' });
  Object.assign(img, { src: avatar, alt: "User's avatar" });
  Object.assign(info, { className: 'info' });
  chat.append(img, info);
  const top = document.createElement('div');
  const buttom = document.createElement('div');
  Object.assign(top, { className: 'top' });
  Object.assign(buttom, { className: 'buttom' });
  info.append(top, buttom);
  const username = document.createElement('div');
  const time = document.createElement('div');
  Object.assign(username, { className: 'username' });
  Object.assign(time, { className: 'time passive' });
  username.appendChild(document.createTextNode(user));
  time.appendChild(document.createTextNode(date));
  top.append(username, time);
  const message = document.createElement('div');
  message.appendChild(document.createTextNode(text));
  Object.assign(message, { className: 'message passive' });
  buttom.appendChild(message);
  const unrMessages = document.createElement('div');
  Object.assign(unrMessages, { className: 'unread-messages' });
  buttom.appendChild(unrMessages);
  if (unreadMessages > 0) {
    const number = buildNumber(unreadMessages);
    unrMessages.appendChild(number);
  }
  return {
    html: chat,
    username: (string) => void (username.innerHTML = string),
    time: (date) => void (time.innerHTML = date),
    message: (text) => void (message.innerHTML = text),
    unreadMessages: (count) => {
      if (count === 0) return void (unrMessages.innerHTML = '');
      const number = unrMessages.firstChild;
      if (number) number.innerHTML = count;
      else unrMessages.appendChild(buildNumber(count));
    },
  };
};

export default class Chat extends EventTarget {
  #chat = null;

  constructor(user) {
    super();
    const { firstName, secondName = '', avatar } = user;
    const chat = buildChat(firstName + ' ' + secondName, avatar);
    chat.html.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('click'));
    });
    this.#chat = chat;
  }

  html() {
    return this.#chat.html;
  }
}

// export default class Chat {
//   #dialog = null;
//   #chat = null;
//   #info = null;
//   #onMessage = null;

//   constructor(data) {
//     const {
//       user: { username, avatar },
//       messages,
//       unreadMessages,
//     } = data;
//     const { message, time } = messages[0];
//     const chat = buildChat(username, avatar, message, time, unreadMessages);
//     const dialog = new Dialog(username, messages);
//     chat.html.addEventListener('click', () => {
//       const active = document.getElementsByClassName('chat active').item(0);
//       if (active) active.classList.remove('active');
//       chat.html.classList.add('active');
//       buttom.innerHTML = '';
//       top.innerHTML = '';
//       dialog.generate();
//       if (this.#info.unreadMessages > 0) {
//         this.#info.unreadMessages = 0;
//         chat.unreadMessages(0);
//         dialog.scroll();
//       }
//     });
//     dialog.onMessage((message) => {
//       this.#onMessage?.(message);
//       chat.message(message);
//     });
//     this.#info = { username, avatar, message, time, unreadMessages };
//     this.#dialog = dialog;
//     this.#chat = chat;
//   }

//   generate() {
//     chatList.appendChild(this.#chat.html);
//   }

//   addMessage(message) {
//     if (!this.isActive()) {
//       const count = ++this.#info.unreadMessages;
//       this.#chat.unreadMessages(count);
//     }
//     this.#dialog.addMessage(message, false);
//     this.#chat.message(message);
//   }

//   isActive() {
//     const active = document.getElementsByClassName('chat active').item(0);
//     return active === this.#chat.html;
//   }

//   onMessage(listener) {
//     this.#onMessage = listener;
//     return this;
//   }
// }
