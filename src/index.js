const init = require('./init');
$(function () {
  const logger = require('./utils/logger');
  // const downloadString = require('./utils/download');
  // let bootstrapCss = 'https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.min.css'
  // let host = location.host;
  // let cacheName = 'cache://' + host;
  // let cache = GM_getValue(cacheName, {});

  logger.info('start init');
  GM_addStyle(require('./resource/style/style.css').default.toString());
  setTimeout(init, 2000);
});
