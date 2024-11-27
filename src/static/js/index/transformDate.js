'use strict';

const options = { hour: 'numeric', minute: 'numeric', hour12: true };

export default (date = new Date()) => date.toLocaleString('en-US', options);
