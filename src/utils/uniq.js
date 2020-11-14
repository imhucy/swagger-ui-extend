module.exports = function uniq(arr, key) {
  var o = {};
  arr.forEach(function (item) {
    let k = item;
    if (key) {
      k = item[key];
    }
    o[k] = item;
  });
  return Object.values(o);
};
