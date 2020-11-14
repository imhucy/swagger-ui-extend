const monkey = require('../../monkey.config.js');
const message = require('./message');
module.exports = {
  info: (...args) => {
    message.apply(this, args);
    console.info(
      `%c[${monkey.header.name}]`,
      'background:#5bc0de;color: #fff;border: 1px solid #46b8da;padding: 0 5px;border-radius: 4px',
      ...args
    );
  },
  debug: (...args) => {
    console.debug(`[${monkey.header.name}]`, ...args);
  },
  warn: (...args) => {
    console.warn(`[${monkey.header.name}]`, ...args);
  }
};
