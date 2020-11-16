// 模板文件
const template = require('../resource/template/form.template.js');
// 下载文件
const download = require('../utils/download');
// 获取apiName
const { getName } = require('./copy-api-config');
const cache = require('../cache');
// 文档遍历查找
const find = require('../utils/find');
const dialog = require('../dialog');
Handlebars.registerHelper('isstring', function (value) {
  return typeof value === 'string';
});
module.exports = function (path) {
  return function (e) {
    let name = cache.get(path) || getName(path);
    let rules = readParams(path);
    let config = {
      name,
      name_snake_case: name.replace(/(A-Z)/g, (z) => '-' + z.toLowerCase()),
      api_add: 'addForm',
      api_edit: 'editForm',
      api_detail: 'detailForm',
      rules: rules
    };
    dialog
      .paramsConfigDialog(config)
      .on('copy', function (config) {
        GM_setClipboard(JSON.stringify(config, null, '  '));
      })
      .on('confirm', function (config) {
        const compileFn = Handlebars.compile(template);
        const fileContent = compileFn(config);
        download(fileContent, 'text/javascript', config.name + '.vue');
      });
  };
};

function readParams(path) {
  let item = find.byPath(path);
  let params = item.parameters;
  let results = [];
  if (params) {
    params.map((param) => {
      let rs = { field: param.name, title: param.description, type: 'input' };
      if (param.name === 'data' && param.in === 'body' && item.description.includes('<table')) {
        $('<div>' + item.description + '</div>')
          .find('tbody tr')
          .map(function () {
            $tr = $(this);
            let title = $tr.find('td:eq(0)').text().trim();
            let field = $tr.find('td:eq(1)').text().trim();
            let validate =
              $tr.find('td:eq(2)').text().trim() === '是'
                ? [{ required: true, message: `${title}是必填的` }]
                : [];
            results.push({ field, title, validate, type: 'input' });
          });
      } else if (param.required) {
        rs.validate = [{ required: true, message: `${rs.title}是必填的` }];
        results.push(rs);
      }
    });
    return results;
  } else {
    return message('文档里没写 params<br>该接口没有参数');
  }
}
