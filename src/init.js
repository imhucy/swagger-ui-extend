const logger = require('./utils/logger');
var swaggerData = {};
var $searchResult = $('<pre class="search-result">chenggongaaa</pre>');
const $searchInput = $(
  `<input type="text" class="form-control" id="search-input" placeholder="搜索 path/tags/desc">`
);
function each(fn) {
  for (var path in swaggerData.paths) {
    for (var method in swaggerData.paths[path]) {
      var item = swaggerData.paths[path][method];
      fn && fn(item, path, method);
    }
  }
}

function initData() {
  var sr = location.pathname.replace('swagger-ui.html', 'swagger-resources');
  $.get(sr).done(function (res) {
    console.log(res[0].url);
    var url = res[0].url;
    var p = location.pathname.replace('/swagger-ui.html', url);
    $.get(p).done(function (res) {
      swaggerData = res;
      console.log(res);
    });
  });
}

function search() {
  $('.topbar').after($searchResult);
  $searchResult.html('');
  var keyword = $searchInput.val();
  var rs = [];
  each(function (item, path, method) {
    var desc = item.description || '';
    var tags = item.tags && item.tags.join();
    tags = tags || '';
    if (
      path.includes(keyword) ||
      desc.includes(keyword) ||
      tags.includes(keyword)
    ) {
      rs.push(tags);
    }
  });
  // rs 去重
  rs = uniq(rs);
  rs.forEach(function (tags) {
    var $link = `<h4 class="search-result-item" href="#/${tags}">${tags}</h4>`;
    $searchResult.append($link);
  });
}

function uniq(arr) {
  var o = {};
  arr.forEach(function (key) {
    o[key] = 1;
  });
  return Object.keys(o);
}
module.exports = function init() {
  $('.topbar-wrapper').html('');
  $searchInput.on('keyup', function (e) {
    if (e.keyCode === 13) {
      search();
    }
  });
  $('.topbar-wrapper').append($searchInput);

  $searchResult.on('click', '.search-result-item', function (e) {
    var href = $(this).attr('href');
    var target = $(`a[href='${href}']`).last();
    // console.log(target.offset().top);
    $('html, body').animate(
      {
        scrollTop: target.offset().top - 100
      },
      600
    );
    target
      .delay(600)
      .css({ color: '#ff0000' })
      .animate({ opacity: 0 }, 60)
      .animate({ opacity: 1 }, 60)
      .animate({ opacity: 0 }, 60)
      .animate({ opacity: 1 }, 60)
      .animate({ opacity: 0 }, 60)
      .animate(
        { opacity: 1 },
        {
          duration: 60,
          complete: function () {
            target.css('color', '');
          }
        }
      );
    target.get(0).click();
  });

  initData();
  logger.info('inited');
};
