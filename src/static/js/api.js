'use strict';

import scaffold from './scaffold.js';
import transport from './transport.js';
import structure from './structure.js';

export default scaffold(transport)(structure, 'https://127.0.0.1:8080/');
