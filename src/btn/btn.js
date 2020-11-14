module.exports = function createBtn(text, container) {
  let btn = $(`
    <div class="svg-button">
      <svg xmlns="http://www.w3.org/2000/svg">
        <path class="border" stroke-linejoin="round" d="" />
      </svg>
      <div class="svg-text">${text}</div>
    </div>
  `);
  btn.appendTo(container);
  let path = btn.find('.border');
  let w = btn.width();
  let h = btn.height();
  path.attr(
    'd',
    `M${w / 2} 1 L${w - 1} 1 L${w - 1} ${h - 1} L1 ${h - 1} L1 1 Z`
  );
  let length = path.get(0).getTotalLength();
  path.css('stroke-dasharray', length);
  path.css('stroke-dashoffset', length);
  btn.mouseleave(function () {
    path.css('stroke-dashoffset', length);
  });
  btn.mouseenter(function () {
    path.css('stroke-dashoffset', 0);
  });
  return btn;
};
