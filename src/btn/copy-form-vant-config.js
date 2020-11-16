const find = require('../utils/find');
const message = require('../utils/message');
module.exports = function onCopyFormConfig(path) {
	return function(e) {
		e.stopPropagation();

		let item = find.byPath(path);
		let content = '\r\n';
		let params = item.parameters;
		console.log(params,'params11')
		if (params) {
			content += params
				.map((param) => {
					let rs = `
						<van-field
						    v-model="${param.name}"
						    name="${param.name}"
						    label="${param.description}"
						    placeholder="${param.description}"
						/>
					`
					if (param.name === 'data' && param.in === 'body' && item.description.includes('<table')) {
						// var html = $('<div>' + item.description + '</div>')
						// 	.find('tbody tr')
						// 	.map(function() {
						// 		$tr = $(this);
						// 		let model = $tr.find('td:eq(1)').text().trim();
						// 		let name = $tr.find('td:eq(0)').text().trim();
						// 		let label = `${name}`;
						// 		let placeholder = `${name}`;
						// 		let rule =
						// 			$tr.find('td:eq(2)').text().trim() === '是' ?
						// 			[{
						// 				required: true,
						// 				message: `${name}是必填的`
						// 			}] :
						// 			[];
						// 		return `${JSON.stringify({ model,name, label , placeholder  , rule })},`;
						// 	})
						// 	.toArray()
						// 	.join('\r\n');
						
						return '没有遇到的格式，叫开发从新写';
					}
					if (param.required) {
						rs = `
							<van-field
							    v-model="${param.name}"
							    name="${param.name}"
							    label="${param.description}"
							    placeholder="${param.description}"
							    :rules="[{ required: true, message: '${param.description}是必填的' }]"
							/>
						`
					}
					return `${rs}`;
				})
				.join('\r\n');
		} else {
			return message('文档里没写params');
		}
		content += '\r\n';
		message('已复制<br>' + content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;'));
		console.log(content);
		GM_setClipboard(content);
	};
};
