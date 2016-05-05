import React, {Component, PropTypes} from 'react';
import {HOC} from 'formsy-react';

class Checkbox extends Component {
  static propTypes = {
    getValue: PropTypes.func,
    setValue: PropTypes.func,
    handleChange: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string
  };

  _handleChange(event) {
    this.props.setValue(event.currentTarget.checked);

    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(event);
    }
  }

  render() {
    return (
      <input className={this.props.className || ''}
             value={this.props.getValue()}
             type="checkbox"
             checked={this.props.getValue() ? 'checked' : null}
             onChange={this._handleChange.bind(this)}/>
    );
  }
}

export default HOC(Checkbox);
