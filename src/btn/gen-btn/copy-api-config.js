const find = require('../utils/find');
const message = require('../utils/message');

module.exports = {
  onCopyApiConfig: function onCopyApiConfig(path) {
    return function (e) {
      e.stopPropagation();

      let item = find.byPath(path);
      console.log('path', path);
      console.log(item);
      let content = getApiConfig(path);
      GM_setClipboard(content);

      message('已复制<br>' + content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;'));
    };
  },
  getApiConfig: function getApiConfig(path) {
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
  },
  onApiNameChange(path) {
    return function (e) {
      let name = $(this).val();
      let c = cache.get();
      c[path] = name;
      cache.set(c);
      message('改名成功<br>' + `${name}`);
    };
  },
  getName(path) {
    let [one, two] = path.split('/').slice(-2);
    return one + two[0].toUpperCase() + two.substr(1);
  }
};
