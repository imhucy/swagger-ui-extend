const find = require('../utils/find');
const message = require('../utils/message');
module.exports = function onCopyForm(path) {
  return function (e) {
    e.stopPropagation();

    let item = find.byPath(path);
    let content = '{\r\n';
    let params = item.parameters;
    if (params) {
      content += params
        .map((param) => {
          let rs = { prop: param.name, label: param.description };
          if (param.name === 'data' && param.in === 'body' && item.description.includes('<table')) {
            return $('<div>' + item.description + '</div>')
              .find('tbody tr')
              .map(function () {
                $tr = $(this);
                let label = $tr.find('td:eq(0)').text().trim();
                let prop = $tr.find('td:eq(1)').text().trim();
                let rule =
                  $tr.find('td:eq(2)').text().trim() === '是'
                    ? [{ required: true, message: `${label}是必填的` }]
                    : [];
                return `// @desc ${label}\r\n${prop}: '',`;
              })
              .toArray()
              .join('\r\n');
          }
          return `// @desc ${rs.label}\r\n${rs.prop}: '',`;
        })
        .join('\r\n');
    } else {
      return message('文档里没写params');
    }
    content += '\r\n},';
    message('已复制<br>' + content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;'));
    console.log(content);
    GM_setClipboard(content);
  };
};
