import React from 'react';
import PropTypes from 'prop-types';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {entityIcons, dataSourceIcons, Tool} from '../../../../lunchbadger-ui/src';

const dataSources = [
  'Memory',
  'REST',
  'SOAP',
  'MongoDB',
  'Redis',
  'MySQL',
  'Ethereum',
  'Salesforce',
];

const dataSourcesWizard = [
  'MongoDB',
  'Redis',
  'MySQL',
];

const getDataSourceType = label => label === 'Ethereum' ? 'web3' : label.toLowerCase();

const wizardFunc = (label) => () => {
  //TODO: implement datasource wizard
};

const getWizardFunc = label => dataSourcesWizard.includes(label) ? wizardFunc(label) : undefined;

const DataSource = ({editedElement}) => {
  const selected = dataSources.includes(editedElement);
  const submenu = [];
  dataSources.forEach((label) => {
    submenu.push({
      label,
      name: label.toLowerCase(),
      icon: dataSourceIcons[label],
      onClick: () => AddDataSource(label, getDataSourceType(label)),
      wizard: getWizardFunc(label),
      wizardTooltip: 'Create and connect to a new data source',
    });
  })
  return (
    <Tool
      icon={entityIcons.DataSource}
      selected={selected}
      submenu={submenu}
      tooltip="Data Source"
      name="dataSource"
    />
  );
}

DataSource.propTypes = {
  editedElement: PropTypes.string,
};

export default DataSource;
