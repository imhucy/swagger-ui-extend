class MetadataBlock {
  constructor() {
    this.name = 'SwaggerUI Extends';
    this.version = '1.0.2';
    this.namespace = 'swagger-ui';
    this.description =
      '扩展SwaggerUI搜索功能|导出Api Config配置|导出Table Config配置|导出Form Config配置';
    this.author = 'hucy';
    this.match = ['http*://*/*/swagger-ui.html', 'http*://*/swagger-ui.html'];
    this.require = [
      'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js',
      'https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js',
      'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js'
    ];
    this.grant = ['GM_addStyle', 'GM_setValue', 'GM_getValue', 'GM_setClipboard'];
  }
}

module.exports = new MetadataBlock();
