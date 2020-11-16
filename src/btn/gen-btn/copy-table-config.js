const find = require('../utils/find');
const message = require('../utils/message');
const dataProtocol = 'apidoc-data://' + location.host;
module.exports = function onCopyTableConfig(path) {
  return function (e) {
    e.stopPropagation();

    let item = find.byPath(path);
    let $ref =
      item.responses &&
      item.responses['200'] &&
      item.responses['200'].schema &&
      item.responses['200'].schema.$ref;
    if ($ref) {
      let key = $ref.split('/').pop();
      let data = GM_getValue(dataProtocol);
      let def = data.definitions[key];
      let content;
      if (def && def.properties) {
        content = Object.keys(def.properties).map((prop) => {
          let item = def.properties[prop];
          if (item) {
            let desc = item.description;
            let label = desc || prop;
            try {
              label = label.match(/^[^（:(：、《【，,\s]+/)[0];
            } catch (e) {
              label = prop;
            }
            let descComment = '';
            if (label != desc && desc) {
              descComment = `// @desc ${desc}\r\n`;
            }
            let rs = { prop, label };
            if (item.type === 'number') {
              rs.align = 'right';
            }
            return `${descComment}${JSON.stringify(rs)},`;
          }
        });
        content = content.join('\r\n');
        content = `[
          ${content}
        ]`;
        console.log(content);
        GM_setClipboard(content);
        message('已复制<br>' + content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;'));
      }
    } else {
      message('没有响应文档<br>' + path);
    }
  };
};
