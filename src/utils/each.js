const dataProtocol = 'apidoc-data://' + location.host;
module.exports = function each(fn) {
  const swaggerData = GM_getValue(dataProtocol);
  for (var path in swaggerData.paths) {
    for (var method in swaggerData.paths[path]) {
      var item = swaggerData.paths[path][method];
      item.method = method;
      fn && fn(item, path, method);
    }
  }
};
