var page;

const elementSelector = '.quadrant:nth-child(1) .Entity.DataSource';
const workspaceStatusSelector = '.workspace-status .ContextualInformationMessage';

function expectInstall(browser, page, finalStatus, finalMsg, skipUpdatingDependenciesCheck) {
  browser.waitForElementVisible('.workspace-status .workspace-status__progress', 120000);
  if (!skipUpdatingDependenciesCheck) {
    page.moveToElement('.logotype', 5, 5);
    browser.click('.logotype');
    page.moveToElement('.workspace-status', 5, 5, function () {
      browser.waitForElementVisible(workspaceStatusSelector, 5000);
      page.expect.element(workspaceStatusSelector).text.to.contain('Updating dependencies');
    });
  }
  page.expect.element('.workspace-status span').to.have.attribute('class')
    .which.contains(`workspace-status__${finalStatus}`).before(120000);
  if (finalStatus === 'success') {
    page.moveToElement('.workspace-status', 5, 5, function () {
      browser.waitForElementVisible(workspaceStatusSelector, 5000);
      page.expect.element(workspaceStatusSelector).text.to.contain(finalMsg);
    });
  } else {
    browser.click('.workspace-status span');
    browser.waitForElementPresent('.SystemDefcon1', 5000);
    browser.click('.SystemDefcon1__box__content__details--link');
    browser.pause(1000);
    page.expect.element('.SystemDefcon1 .SystemDefcon1__box__content__details--box').text.to.contain(finalMsg);
  }
}

module.exports = {
  // '@disabled': true,
  'Connector installation: data source add': function(browser) {
    page = browser.page.lunchBadger();
    page.open();
    browser.click('.workspace-status span');
    page.addElementFromTooltip('dataSource', 'rest');
    browser.waitForElementPresent(elementSelector + '.rest.editable .EntityHeader .EntityProperty__field--input input', 5000);
    browser.setValue(elementSelector + '.rest.editable .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'dumpUrl');
    browser.setValue(elementSelector + '.rest.editable .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input', 'dumpDatabase');
    browser.setValue(elementSelector + '.rest.editable .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--input input', 'dumpUsername');
    browser.setValue(elementSelector + '.rest.editable .EntityProperties .EntityProperty:last-child .EntityProperty__field--input input', 'dumpPassword');
    browser.sendKeys(elementSelector + '.rest.editable .EntityHeader .EntityProperty__field--input input', browser.Keys.ENTER);
    expectInstall(browser, page, 'success', 'Workspace OK');
  },

  'Connector installation: add more data source': function(browser) {
    page.addElementFromTooltip('dataSource', 'soap');
    browser.waitForElementVisible(elementSelector + '.soap.editable .EntityHeader .EntityProperty__field--input input', 5 * 60 * 1000);
    browser.pause(5000);
    browser.setValue(elementSelector + '.soap.editable .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'dumpUrl');
    browser.setValue(elementSelector + '.soap.editable .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input', 'dumpDatabase');
    browser.setValue(elementSelector + '.soap.editable .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--input input', 'dumpUsername');
    browser.setValue(elementSelector + '.soap.editable .EntityProperties .EntityProperty:last-child .EntityProperty__field--input input', 'dumpPassword');
    browser.sendKeys(elementSelector + '.soap.editable .EntityHeader .EntityProperty__field--input input', browser.Keys.ENTER);
    browser.waitForElementVisible('.SystemDefcon1', 5 * 60 * 1000);
    browser.click('.SystemDefcon1 button');
    browser.waitForElementNotPresent('.SystemDefcon1', 5000);
    page.addElementFromTooltip('dataSource', 'mongodb');
    browser.waitForElementVisible(elementSelector + '.mongodb.editable .EntityHeader .EntityProperty__field--input input', 5 * 60 * 1000);
    browser.pause(5000);
    browser.setValue(elementSelector + '.mongodb.editable .EntityProperties .EntityProperty:first-child .EntityProperty__field--input input', 'mongodb://dumpUrl');
    browser.setValue(elementSelector + '.mongodb.editable .EntityProperties .EntityProperty:nth-child(2) .EntityProperty__field--input input', 'dumpDatabase');
    browser.setValue(elementSelector + '.mongodb.editable .EntityProperties .EntityProperty:nth-child(3) .EntityProperty__field--input input', 'dumpUsername');
    browser.setValue(elementSelector + '.mongodb.editable .EntityProperties .EntityProperty:last-child .EntityProperty__field--input input', 'dumpPassword');
    browser.sendKeys(elementSelector + '.mongodb.editable .EntityHeader .EntityProperty__field--input input', browser.Keys.ENTER);
    expectInstall(browser, page, 'failure', '?wsdl')
  },

  'Connector uninstallation: remove datasource': function(browser) {
    browser.click('.SystemDefcon1 button');
    browser.waitForElementNotPresent('.SystemDefcon1', 5000);
    browser.click(elementSelector + '.mongodb');
    browser.pause(1500);
    browser.waitForElementVisible(elementSelector + '.mongodb .Toolbox__button--delete', 50000);
    browser.click(elementSelector + '.mongodb .Toolbox__button--delete');
    browser.pause(1500);
    browser.click('.modal__actions__button.modal__actions__button--confirm');
    expectInstall(browser, page, 'failure', '?wsdl');
  },

  'Connector uninstallation: trash workspace': function(browser) {
    browser.click('.SystemDefcon1 button');
    browser.waitForElementNotPresent('.SystemDefcon1', 5000);
    browser.click('.header__menu__element .fa-trash-o');
    expectInstall(browser, page, 'success', 'Workspace OK', true);
  },

  after: function(browser) {
    page.close();
  }
}
