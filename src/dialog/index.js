module.exports = {
  create(content) {
    let dialog = $(`<div class="sw-ui-extend-dialog"></div>`);
    let mask = $(`<div class="sw-ui-extend-dialog-mask"></div>`);
    let closeBtn = $(`<div class="sw-ui-extend-close-btn">关闭</div>`);
    let confirmBtn = $(`<div class="sw-ui-extend-confirm-btn">保存配置并导出</div>`);
    let copyBtn = $(`<div class="sw-ui-extend-copy-btn">保存配置并复制到剪贴板</div>`);
    closeBtn.click(function (e) {
      dialog.css({
        transform: 'translate3d(-50%, -50%, 0) scale(0)',
        opacity: 0
      });
      mask.animate({ opacity: 0 }, 400, function () {
        mask.remove();
      });
      setTimeout(() => {
        dialog.remove();
      }, 400);
    });
    dialog.append(closeBtn);
    dialog.append(content);
    dialog.append(confirmBtn);
    dialog.append(copyBtn);
    let height = $(window).height();
    let width = $(window).width();
    dialog.css({
      top: height / 2,
      left: width / 2,
      opacity: 0,
      transition: 'all 0.4s',
      transform: 'translate3d(-50%, -50%, 0) scale(0)'
    });
    mask.appendTo('body');
    mask.animate({
      opacity: 0.5
    });
    dialog.appendTo('body');
    dialog.animate({}, function () {
      dialog.css({
        width: width - 40,
        opacity: 1,
        transform: 'translate3d(-50%, -50%, 0) scale(1)'
      });
    });

    return { confirmBtn, copyBtn };
  },
  paramsConfigDialog(data) {
    let box = $(`<div class="params-config-dialog"></div>`);
    let apiConfigBox = $(`<div class="global-params-config"></div>`);
    let addApi = $(`<input name="api_add" placeholder="add apiname 定义添加接口名称" />`);
    let editApi = $(`<input name="api_edit" placeholder="edit apiname 定义编辑接口名称" />`);
    let detailApi = $(`<input name="api_detail" placeholder="detail apiname 定义详情接口名称" />`);
    apiConfigBox.append(addApi);
    apiConfigBox.append(editApi);
    apiConfigBox.append(detailApi);
    apiConfigBox.appendTo(box);

    let table = `<table class="params-config-dialog-table">`;
    let head = `<thead><tr>`;
    head += [
      'field',
      'title',
      'required',
      '组件名称(type)',
      '默认值(value)',
      '长度限制(maxlength)',
      'options',
      '字典名(dictname)'
    ]
      .map((th) => `<th>${th}</th>`)
      .join('');
    head += `</tr></thead>`;
    table += head;
    let body = `<tbody>`;
    body += data.rules
      .map((item) => {
        return `<tr>
        <td>${item.field}<input type="hidden" name="field" value="${item.field}" /></td>
        <td>${item.title}<input type="hidden" name="title" value="${item.title}" /></td>
        <td>
          ${item.required || 'false'}
          <input type="hidden" name="required" value="${item.required || 'false'}" />
        </td>
        <td><input type="text" value="${item.type}" name="type" placeholder="组件名称(type)" /></td>
        <td><input type="text" value="${item.value || ''}" name="value" placeholder="默认值" /></td>
        <td><input type="text" value="${
          item.maxlength || ''
        }" name="maxlength" placeholder="长度限制" /></td>
        <td><textarea value="${
          item.options && typeof item.options !== 'string'
            ? JSON.stringify(item.options)
            : item.options
        }" name="options" placeholder="options" /></td>
        <td><input type="text" value="${
          item.dictname || ''
        }" name="dictname" placeholder="字典名(仅select组件可用)" /></td>
      </tr>`;
      })
      .join('');
    body += `</tbody>`;
    table += body;
    $(table).appendTo(box);
    const { confirmBtn, copyBtn } = this.create(box);
    confirmBtn.click(function () {
      events.confirm();
    });
    copyBtn.click(function () {
      events.copy();
    });
    let events = {};
    return {
      on(type, fn) {
        events[type] = fn;
        return this;
      }
    };
  }
};
