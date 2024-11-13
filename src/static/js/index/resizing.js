'use strict';

const resizer = document.getElementsByClassName('resizer').item(0);
const chats = document.getElementsByClassName('chats').item(0);
const dialog = document.getElementsByClassName('dialog').item(0);

export default () => {
  let resizing = false;
  resizer.addEventListener('mousedown', () => {
    document.body.style.cursor = 'ew-resize';
    document.body.style['user-select'] = 'none';
    resizing = true;
  });
  document.addEventListener('mouseup', () => {
    document.body.style.cursor = 'auto';
    document.body.style['user-select'] = 'auto';
    resizing = false;
  });
  document.addEventListener('mousemove', (event) => {
    if (!resizing) return;
    const { innerWidth: width } = window;
    const { clientX: x } = event;
    const chatsPart = (100 * x) / width;
    const dialogsPart = 100 - chatsPart;
    chats.style.flex = chatsPart;
    dialog.style.flex = dialogsPart;
  });
};
