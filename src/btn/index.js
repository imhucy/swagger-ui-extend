const createBtn = require('./btn');
const find = require('../utils/find');
const message = require('../utils/message');
const downloadString = require('../utils/download');
const cache = require('../cache');
const onCopyPath = require('./copy-path');
const onCopyTableConfig = require('./copy-table-config');
const { onCopyApiConfig, getApiConfig, onApiNameChange, getName } = require('./copy-api-config');
const onCopyForm = require('./copy-form');
const onCopyFormConfig = require('./copy-form-config');
const dataProtocol = 'apidoc-data://' + location.host;

module.exports = function () {
  $(window).on('DOMNodeInserted', onInserted);
  $(window).on('DOMNodeRemoved', onRemoved);
  initGlobalBtns();
};

function initGlobalBtns() {
  let $navBtns = $('<div>').appendTo($('.topbar-wrapper'));

  createBtn('导出展开项 Api Config 配置', $navBtns).click(function () {
    let exportContent = 'export default [\r\n';
    exportContent += $('.opblock .opblock-summary-path')
      .map(function () {
        let $this = $(this);
        let path = $this.text().trim();
        return getApiConfig(path);
      })
      .toArray()
      .join('\r\n');
    exportContent += '\r\n]';
    downloadString(exportContent, 'text/javascript', 'apiConfig.js');
  });

  createBtn('清除文档缓存数据', $navBtns).click(function () {
    GM_setValue(dataProtocol, '');
    message('已清除 缓存数据');
  });
}

function onInserted(e) {
  $(e.target)
    .find('.opblock .opblock-summary-path')
    .each(function () {
      let $this = $(this);
      let path = $this.text().trim();
      let $box = $('<div class="opblock-extend-btns">');
      $this.parents('.opblock-summary').before($box);

      $('<input style="margin-right:10px" />')
        .appendTo($box)
        .click((e) => e.stopPropagation())
        .change(onApiNameChange(path))
        .val(cache.get(path) || getName(path));

      createBtn('Path', $box).click(onCopyPath(path));
      createBtn('Api Config', $box).click(onCopyApiConfig(path));
      createBtn('复制 Table Config', $box).click(onCopyTableConfig(path));
      createBtn('复制 Form', $box).click(onCopyForm(path));
      createBtn('复制 Form Config', $box).click(onCopyFormConfig(path));
    });
}

function onRemoved(e) {
  let $box = $(e.target);
  $box.find('.svg-button').off();
}
