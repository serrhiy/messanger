'use strict';

import structure from './structure.js';
import scaffold from './scaffold.js'
import transport from './transport.js';

export default scaffold(transport)(structure, 'https://127.0.0.1:8080/');
