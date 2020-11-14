const initSearch = require('./search');
const initData = require('./data');
const initPathBtns = require('./btn');
module.exports = function init() {
  initData();
  initSearch();
  initPathBtns();
};
