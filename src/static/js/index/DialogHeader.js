'use strict';

const top = document.querySelector('.dialog .top');

const buildHeader = (name, shortInfo) => {
  const dialog = document.createElement('div');
  const left = document.createElement('div');
  const right = document.createElement('div');
  Object.assign(dialog, { className: 'dialog-header' });
  Object.assign(left, { className: 'left' });
  Object.assign(right, { className: 'right' });
  dialog.append(left, right);
  const username = document.createElement('div');
  const info = document.createElement('div');
  Object.assign(username, { className: 'username' });
  Object.assign(info, { className: 'short-info' });
  username.appendChild(document.createTextNode(name));
  info.appendChild(document.createTextNode(shortInfo));
  left.append(username, info);
  const more = document.createElement('div');
  Object.assign(more, { className: 'more-info' });
  more.append(
    document.createElement('div'),
    document.createElement('div'),
    document.createElement('div'),
  );
  right.appendChild(more);
  return dialog;
};

export default class DialogHeader {
  #header = null;

  constructor(username) {
    this.#header = buildHeader(username, 'last seen recently');
  }

  generate() {
    top.appendChild(this.#header);
  }
}
