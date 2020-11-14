class MetadataBlock {
  constructor() {
    this.name = 'SwaggerUI Extends';
    this.version = '1.0.0';
    this.description = '展开Swagger方便搜索|导出rd-http配置';
    this.author = 'hucy';
    this.match = ['http*://*/*/swagger-ui.html', 'http*://*/swagger-ui.html'];
    this.require = [
      'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js',
      'https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js'
    ];
    this.grant = [
      'GM_addStyle',
      'GM_setValue',
      'GM_getValue',
      'GM_setClipboard'
    ];
  }
}

module.exports = new MetadataBlock();
