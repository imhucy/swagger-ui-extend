const createBtn = require('./btn');
const find = require('../utils/find');
const message = require('../utils/message');
const downloadString = require('../utils/download');
const cache = require('../cache');
module.exports = function () {
  $(window).on('DOMNodeInserted', onInserted);
  $(window).on('DOMNodeRemoved', onRemoved);
  initGlobalBtns();
};

function initGlobalBtns() {
  let $navBtns = $('<div>').appendTo($('.topbar-wrapper'));

  createBtn('导出展开接口配置', $navBtns).click(function () {
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
    GM_setValue('data', '');
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
      $this.parents('.opblock-summary').append($box);

      $('<input style="margin-right:10px" />')
        .appendTo($box)
        .click((e) => e.stopPropagation())
        .change(onApiNameChange(path))
        .val(cache.get(path) || getName(path));

      createBtn('复制 Path', $box).click(onCopyPath(path));
      createBtn('复制 Api Config', $box).click(onCopyConfig(path));
      createBtn('复制 Table Config', $box).click(onCopyTableConfig(path));
      createBtn('复制 Form', $box).click(onCopyForm(path));
      createBtn('复制 Form Config', $box).click(onCopyFormConfig(path));
    });
}

function onRemoved(e) {
  let $box = $(e.target);
  $box.find('.svg-button').off();
}

function onCopyTableConfig(path) {
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
      let data = GM_getValue('data');
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
        message(
          '已复制<br>' + content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
        );
      }
    } else {
      message('没有响应文档<br>' + path);
    }
  };
}

function onCopyConfig(path) {
  return function (e) {
    e.stopPropagation();

    let item = find.byPath(path);
    console.log('path', path);
    console.log(item);
    let content = getApiConfig(path);
    GM_setClipboard(content);

    message(
      '已复制<br>' + content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
    );
  };
}

function onCopyPath(path) {
  return function (e) {
    e.stopPropagation();
    GM_setClipboard(path);
    message('已复制<br>' + path);
  };
}

function onCopyForm(path) {
  return function (e) {
    e.stopPropagation();

    let item = find.byPath(path);
    let content = '{\r\n';
    let params = item.parameters;
    if (params) {
      content += params
        .map((param) => {
          let rs = { prop: param.name, label: param.description };
          if (
            param.name === 'data' &&
            param.in === 'body' &&
            item.description.includes('<table')
          ) {
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
    message(
      '已复制<br>' + content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
    );
    console.log(content);
    GM_setClipboard(content);
  };
}

function onCopyFormConfig(path) {
  return function (e) {
    e.stopPropagation();

    let item = find.byPath(path);
    let content = '[\r\n';
    let params = item.parameters;
    if (params) {
      content += params
        .map((param) => {
          let rs = { prop: param.name, label: param.description };
          if (
            param.name === 'data' &&
            param.in === 'body' &&
            item.description.includes('<table')
          ) {
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
                return `${JSON.stringify({ label, prop, rule })},`;
              })
              .toArray()
              .join('\r\n');
          }
          if (param.required) {
            rs.rule = [{ required: true, message: `${rs.label}是必填的` }];
          }
          return `${JSON.stringify(rs)},`;
        })
        .join('\r\n');
    } else {
      return message('文档里没写params');
    }
    content += '\r\n],';
    message(
      '已复制<br>' + content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
    );
    console.log(content);
    GM_setClipboard(content);
  };
}

function onApiNameChange(path) {
  return function (e) {
    let name = $(this).val();
    let c = cache.get();
    c[path] = name;
    cache.set(c);
    message('改名成功<br>' + `${name}`);
  };
}

function getName(path) {
  let [one, two] = path.split('/').slice(-2);
  return one + two[0].toUpperCase() + two.substr(1);
}

function getApiConfig(path) {
  let item = find.byPath(path);
  let method = item.method;
  let name = cache.get(path) || getName(path);
  return `
// @desc ${item.summary}
// @desc ${item.tags.join('')}
${JSON.stringify(
  {
    name: name,
    method: method.toLowerCase(),
    url: path
  },
  null,
  '  '
)},`;
}
