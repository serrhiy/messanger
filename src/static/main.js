'use strict';

const main = () => {
  const socket = new WebSocket('wss://127.0.0.1:8001/');
  const chat = document.getElementById('chat');
  const msg = document.getElementById('msg');
  msg.focus();

  const writeLine = (text) => {
    const line = document.createElement('div');
    line.innerHTML = `<p>${text}</p>`;
    chat.appendChild(line);
  };

  socket.addEventListener('open', () => {
    writeLine('connected');
  });

  socket.addEventListener('close', () => {
    writeLine('closed');
  });

  socket.addEventListener('message', ({ data }) => {
    const messages = JSON.parse(data);
    for (const message of messages) writeLine(message);
  });

  msg.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const { value: string } = msg;
    msg.value = '';
    writeLine(string);
    socket.send(string);
  });
};

main();