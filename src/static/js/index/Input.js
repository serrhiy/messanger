'use strict';

const buttom = document.querySelector('.dialog .buttom');

const buildInput = () => {
  const messageInput = document.createElement('div');
  const input = document.createElement('input');
  Object.assign(messageInput, { className: 'message-input' });
  Object.assign(input, { type: 'text', placeholder: 'Write a message...' });
  messageInput.appendChild(input);
  return [messageInput, input];
};

export default class Input {
  #onMessage = null;
  #messageInput = null;

  constructor() {
    const [messageInput, input] = buildInput();
    input.addEventListener('keypress', (event) => {
      const { value: text } = input;
      if (event.key !== 'Enter' || text.length === 0) return;
      input.value = '';
      this.#onMessage?.(text);
    });
    this.#messageInput = messageInput;
  }

  generate() {
    buttom.appendChild(this.#messageInput);
  }

  onMessage(listener) {
    this.#onMessage = listener;
    return this;
  }
}
