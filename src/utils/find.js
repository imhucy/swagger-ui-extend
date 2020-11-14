const each = require('./each');
module.exports = {
  byPath(p) {
    let item;
    each(function (o, path, method) {
      if (path === p) {
        item = o;
      }
    });
    console.log(item);
    return item;
  },
  responseByPath(p) {}
};
