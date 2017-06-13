import React, {Component} from 'react';
import PropTypes from 'prop-types';
import removeAPIForecast from '../../../actions/APIForecast/remove';

export default class ForecastNav extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onExpand: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  remove = () => {
    this.props.onClose();
    removeAPIForecast(this.props.entity.id);
  }

  toggleExpand = () => {
    this.props.onExpand();
  }

  render() {
    return (
      <ul className="api-forecast__header__nav">
        <li>
          <a onClick={this.remove}>
            <i className="fa fa-remove"/>
          </a>
        </li>
        <li>
          <a onClick={this.toggleExpand}>
            <i className="icon-icon-resize"/>
          </a>
        </li>
      </ul>
    );
  }
}
