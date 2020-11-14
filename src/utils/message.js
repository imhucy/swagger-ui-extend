var msgs = [];
module.exports = function message(msg) {
  let $msg = $('<div class="tm-message">')
    .html(msg || '消息')
    .css('display', 'none')
    .appendTo('body');
  let last = msgs[msgs.length - 1];
  $msg.css({
    top: last ? last.position().top + last.height() + 30 : 100
  });
  $msg.show(400, function () {
    setTimeout(function () {
      let height = $msg.height();
      $msg.hide('fast', function () {
        let i = msgs.indexOf($msg);
        msgs.splice(i, 1);
        $msg.remove();
        msgs.forEach((item) => {
          let top = item.css('top');
          top = parseInt(top);
          top -= height + 30;
          item.animate({ top }, 'fast');
        });
      });
    }, 4000);
  });
  msgs.push($msg);
};
