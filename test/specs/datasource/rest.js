module.exports = {
  // '@disabled': true,
  'Datasource: rest': function (browser) {
    var page = browser.page.lunchBadger();
    page.open();
    page.testDatasource('rest', [
      ['URL', 'dumpUrl']
    ]);
    page.close();
  }
};
