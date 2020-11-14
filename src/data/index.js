module.exports = function initData() {
  let data = GM_getValue('data');
  if (data) return;
  var sr = location.pathname.replace('swagger-ui.html', 'swagger-resources');
  $.get(sr).done(function (res) {
    console.log(res[0].url);
    var url = res[0].url;
    var p = location.pathname.replace('/swagger-ui.html', url);
    $.get(p).done(function (res) {
      GM_setValue('data', res);
    });
  });
};
