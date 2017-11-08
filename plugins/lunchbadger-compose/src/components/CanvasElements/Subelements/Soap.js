import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import _ from 'lodash';
import {
  EntityProperty,
  EntityProperties,
  EntityPropertyLabel,
  CollapsibleProperties,
  IconButton,
  Input,
  Checkbox,
  Table,
} from '../../../../../lunchbadger-ui/src';

const widths = [200, 200, 200, undefined, 70];
const paddings = [true, true, true, true, false];
const centers = [false, false, false, false, false];
const optionsScheme = ['WS', 'BasicAuth', 'ClientSSL'].map(label => ({label, value: label}));
const optionsPasswordType = ['PasswordText', 'PasswordDigest'].map(label => ({label, value: label}));
const transformOperations = operations => Object.keys(operations).map(key => ({
  key,
  service: operations[key].service,
  port: operations[key].port,
  operation: operations[key].operation,
}));

export default class Soap extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    plain: PropTypes.bool,
    onStateChange: PropTypes.func,
  };

  static defaultProps = {
    plain: false,
    onStateChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = this.initState(props);
    this.onPropsUpdate = (callback, props = this.props) => this.setState(this.initState(props), callback);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entity !== this.props.entity) {
      this.onPropsUpdate(undefined, nextProps);
    }
  }

  initState = (props = this.props) => {
    const {entity} = props;
    const security = _.cloneDeep(entity.security);
    const soapOperations = _.cloneDeep(entity.soapOperations);
    return {
      security,
      soapOperations: transformOperations(soapOperations),
    };
  };

  changeState = state => this.setState(state, this.props.onStateChange);

  handleSecuritySchemeChange = (scheme) => {
    if (this.state.security.scheme === scheme) return;
    const {username, password} = this.state.security;
    const security = {scheme};
    if (scheme === 'WS' || scheme === 'BasicAuth') {
      security.username = username || '';
      security.password = password || '';
    }
    if (scheme === 'WS') {
      security.passwordType = 'PasswordText';
    }
    if (scheme === 'ClientSSL') {
      security.keyPath = '';
      security.certPath = '';
    }
    this.changeState({security});
  };

  handleAddOperation = () => {
    const soapOperations = _.cloneDeep(this.state.soapOperations);
    soapOperations.push({
      key: '',
      service: '',
      port: '',
      operation: '',
    });
    this.changeState({soapOperations});
    setTimeout(() => {
      const idx = soapOperations.length - 1;
      const input = document.getElementById(`soapOperations[${idx}][key]`);
      input && input.focus();
    });
  };

  handleOperationUpdate = (idx, field) => ({target: {value}}) => {
    const soapOperations = _.cloneDeep(this.state.soapOperations);
    soapOperations[idx][field] = value;
    this.changeState({soapOperations});
  };

  handleOperationTab = (event) => {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey) {
      this.handleAddOperation();
    }
  };

  handleRemoveOperation = idx => () => {
    const soapOperations = _.cloneDeep(this.state.soapOperations);
    soapOperations.splice(idx, 1);
    this.changeState({soapOperations});
  };

  renderProperties = () => {
    const {entity, plain} = this.props;
    const {url, wsdl, remotingEnabled} = entity;
    return (
      <div className="Soap__options">
        {!plain && (
          <span>
            <EntityProperty
              title="URL"
              name="url"
              value={url}
            />
          </span>
        )}
        <span>
          <EntityProperty
            title="WSDL"
            name="wsdl"
            value={wsdl}
          />
        </span>
        <span>
          <Checkbox
            label="Remoting Enabled"
            name="remotingEnabled"
            value={remotingEnabled || false}
          />
        </span>
      </div>
    );
  };

  renderWsdlOptions = () => {
    const {wsdl_options: {rejectUnauthorized, strictSSL, requestCert}} = this.props.entity;
    return (
      <div className="Soap__options">
        <span>
          <Checkbox
            label="Reject Unauthorized"
            name="wsdl_options[rejectUnauthorized]"
            value={rejectUnauthorized || false}
          />
        </span>
        <span>
          <Checkbox
            label="Strict SSL"
            name="wsdl_options[strictSSL]"
            value={strictSSL || false}
          />
        </span>
        <span>
          <Checkbox
            label="Request Certificate"
            name="wsdl_options[requestCert]"
            value={requestCert || false}
          />
        </span>
      </div>
    );
  };

  renderOperations = () => {
    const columns = [
      'Key',
      'Service',
      'Port',
      'Operation',
      <IconButton icon="iconPlus" onClick={this.handleAddOperation} />,
    ];
    const {soapOperations} = this.state;
    const soapOperationsSize = soapOperations.length - 1;
    const data = soapOperations.map(({key, service, port, operation}, idx) => ([
      <Input
        name={`soapOperations[${idx}][key]`}
        value={key}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleOperationUpdate(idx, 'key')}
      />,
      <Input
        name={`soapOperations[${idx}][service]`}
        value={service}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleOperationUpdate(idx, 'service')}
      />,
      <Input
        name={`soapOperations[${idx}][port]`}
        value={port}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleOperationUpdate(idx, 'port')}
      />,
      <Input
        name={`soapOperations[${idx}][operation]`}
        value={operation}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleOperationUpdate(idx, 'operation')}
        handleKeyDown={idx === soapOperationsSize ? this.handleOperationTab : undefined}
      />,
      <IconButton icon="iconDelete" onClick={this.handleRemoveOperation(idx)} />,
    ]));
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      centers={centers}
    />;
  };

  renderSecurity = () => {
    const {security} = this.state;
    const {scheme} = security;
    let properties = [{
      name: 'scheme',
      options: optionsScheme,
      onChange: this.handleSecuritySchemeChange,
      width: 130,
    }];
    if (scheme === 'WS' || scheme === 'BasicAuth') {
      properties.push({name: 'username', width: 200});
      properties.push({name: 'password', width: 200, password: true});
    }
    if (scheme === 'WS') {
      properties.push({name: 'passwordType', options: optionsPasswordType, width: 180});
    }
    if (scheme === 'ClientSSL') {
      properties.push({name: 'keyPath'});
      properties.push({name: 'certPath'});
    }
    properties = properties.map(item => ({
      ...item,
      title: _.startCase(item.name),
      name: `security[${item.name}]`,
      value: security[item.name],
      placeholder: ' ',
    }));
    return (
      <div>
        {properties.map(item => <EntityProperty key={item.name} {...item} />)}
      </div>
    );
  };

  render() {
    const {entity: {url}, plain} = this.props;
    const properties = [{title: 'Url', name: 'url', value: url}];
    return (
      <div className={cs('Soap', {plain, notPlain: !plain})}>
        {plain && <EntityProperties properties={properties} />}
        <div style={{display: plain ? 'none' : 'block'}}>
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Properties</EntityPropertyLabel>}
            collapsible={this.renderProperties()}
            defaultOpened
            barToggable
          />
          <CollapsibleProperties
            bar={<EntityPropertyLabel>WSDL Options</EntityPropertyLabel>}
            collapsible={this.renderWsdlOptions()}
            defaultOpened
            barToggable
          />
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Operations</EntityPropertyLabel>}
            collapsible={this.renderOperations()}
            defaultOpened
            barToggable
          />
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Security</EntityPropertyLabel>}
            collapsible={this.renderSecurity()}
            defaultOpened
            barToggable
          />
        </div>
      </div>
    );
  }
}
