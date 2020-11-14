let cacheName = 'apiname://' + location.host;
module.exports = {
  get(path) {
    let cache = GM_getValue(cacheName, {});
    if (path) return cache[path];
    return cache;
  },
  set(cache) {
    GM_setValue(cacheName, cache);
  }
};
