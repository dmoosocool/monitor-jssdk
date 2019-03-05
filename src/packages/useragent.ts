'use strict';

import { UAParser } from 'ua-parser-js';
const result = new UAParser(navigator.userAgent).getResult();

export {
  result
};