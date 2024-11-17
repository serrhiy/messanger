'use strict';

const fileInput = document.getElementById('file-input');
const fileInputLable = document.getElementById('file-input-label');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  fileInputLable.innerText = 'selected';
});
