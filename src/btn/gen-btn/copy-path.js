module.exports = function onCopyPath(path) {
  return function (e) {
    e.stopPropagation();
    GM_setClipboard(path);
    message('已复制<br>' + path);
  };
};
