'use strict';

const TOKEN_LENGTH = 64;
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

module.exports = () => {
  const base = ALPHA_DIGIT.length;
  const chars = new Array(TOKEN_LENGTH);
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    const index = Math.floor(Math.random() * base);
    chars.push(ALPHA_DIGIT[index]);
  }
  return chars.join('');
};
