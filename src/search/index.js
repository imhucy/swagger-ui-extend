const each = require('../utils/each');
const uniq = require('../utils/uniq');
const ui = require('./ui');
const $searchInput = $(ui.input);
const $searchResult = $(ui.results);
module.exports = function init() {
  $('.topbar-wrapper').html('');
  $('.topbar-wrapper').append($searchInput);
  $('.topbar').after($searchResult);
  $searchInput.on('keyup', onEnter);
  $searchResult.on('click', '.search-result-item', onClickSearchItem);
};
// 搜索 trigger
function onEnter(e) {
  if (e.keyCode === 13) {
    search();
  }
}
// 滚动到指定位置, 并展开
function onClickSearchItem() {
  var href = $(this).attr('href');
  var path = $(this).data('path');
  var target = $(`a[href='${href}']`).last();
  var scrollTop = target.offset().top - 100;
  $('html, body').animate({ scrollTop }, 300);
  function onEnd() {
    target.css('color', '');
    let isOpen = target.parents('.opblock-tag-section').hasClass('is-open');
    if (!isOpen) {
      target.get(0).click();
    }
    setTimeout(onOpened, 0);
  }
  function onOpened() {
    target
      .parents('.opblock-tag-section')
      .find('.opblock-summary-path')
      .each(function () {
        let $path = $(this);
        if ($path.text().trim() === path) {
          flash($path, function () {
            $path.css('color', '');
            let isOpen = $path.parents('.opblock').hasClass('is-open');
            if (!isOpen) {
              $path.get(0).click();
            }
          });
        }
      });
  }
  flash(target, onEnd);
}

function flash(target, onEnd) {
  target
    .css({ color: '#ff0000' })
    .animate({ opacity: 0 }, 60)
    .animate({ opacity: 1 }, 60)
    .animate({ opacity: 0 }, 60)
    .animate({ opacity: 1 }, 60)
    .animate({ opacity: 0 }, 60)
    .animate({ opacity: 1 }, 60, onEnd);
}
// 搜索
function search() {
  $searchResult.html('');
  // 搜索关键词
  const keyword = $searchInput.val();
  var rs = [];
  // 遍历所有接口, 从接口的path,desc,tags中查找匹配
  each(function (item, path, method) {
    var desc = item.description || '';
    var tags = item.tags && item.tags.join();
    tags = tags || '';
    if (path.includes(keyword) || desc.includes(keyword) || tags.includes(keyword)) {
      rs.push({ tags, path });
    }
  });
  // rs 去重
  rs = uniq(rs, 'path');
  // 添加到页面显示
  rs.forEach(function ({ tags, path }, i) {
    var $link = $(`<h4 class="search-result-item" href="#/${tags}">${tags}</h4>`);
    $link.data('path', path);
    $link.css('display', 'none');
    $searchResult.append($link);
    $link.delay(i * 40).show('fast');
  });
}
