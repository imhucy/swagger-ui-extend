const init = require('./init');
$(function () {
  const logger = require('./utils/logger');
  logger.info('script loaded');
  GM_addStyle(require('./resource/style/style.css').default.toString());
  setTimeout(init, 2000);
});
