'use strict';

import endpoints from './endpoints.js';
import scaffold from './scaffold.js';
import transports from './transports.js';

export default scaffold(endpoints, transports);
