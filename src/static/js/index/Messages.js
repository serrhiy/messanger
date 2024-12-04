'use strict';

import Input from './Input.js';
import DialogHeader from './DialogHeader.js';
import transformDate from './transformDate.js';

const buttom = document.querySelector('.dialog .buttom');

const buildMessages = () => {
  const messages = document.createElement('div');
  return Object.assign(messages, { className: 'messages' });
};

const buildMessage = (text, time, myMessage = true) => {
  const message = document.createElement('div');
  const messageText = document.createElement('div');
  const messageTime = document.createElement('div');
  Object.assign(message, { className: myMessage ? 'my' : 'other' });
  Object.assign(messageText, { className: 'text' });
  Object.assign(messageTime, { className: 'time' });
  messageText.appendChild(document.createTextNode(text));
  messageTime.appendChild(document.createTextNode(time));
  message.append(messageText, messageTime);
  return message;
};

export default class Messages {
  #input = null;
  #header = null;
  #onMessage = null;
  #messagesDiv = null;

  constructor(user, messages) {
    const messagesDiv = buildMessages();
    for (const { message, createdAt, myMessage } of messages) {
      const time = transformDate(createdAt);
      const generated = buildMessage(message, time, myMessage);
      messagesDiv.appendChild(generated);
    }
    this.#input = new Input().onMessage((message) => {
      this.addMessage(message, true);
      this.#onMessage?.(message);
    });
    const time = user.lastOnline
      ? 'was online at ' + transformDate(new Date(user.lastOnline))
      : 'last seen recently';
    this.#header = new DialogHeader(user.username, time);
    this.#messagesDiv = messagesDiv;
  }

  onMessage(listener) {
    this.#onMessage = listener;
    return this;
  }

  generate() {
    this.#header.generate();
    buttom.appendChild(this.#messagesDiv);
    this.#input.generate();
  }

  scroll() {
    buttom.scrollTop = buttom.scrollHeight;
  }

  addMessage(message, myMessage = true, time = transformDate()) {
    const generated = buildMessage(message, time, myMessage);
    this.#messagesDiv.appendChild(generated);
    this.scroll();
  }
}
