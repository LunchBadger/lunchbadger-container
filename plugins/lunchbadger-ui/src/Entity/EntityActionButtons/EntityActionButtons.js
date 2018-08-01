import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {Button} from '../../';
import './EntityActionButtons.scss';

export default class EntityActionButtons extends PureComponent {
  static propTypes = {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    zoom: PropTypes.bool,
    okDisabled: PropTypes.bool,
    okLabel: PropTypes.string,
    submit: PropTypes.bool,
    skipCancel: PropTypes.bool,
  };

  static defaultProps = {
    onOk: undefined,
    zoom: false,
    okDisabled: false,
    okLabel: 'OK',
    submit: true,
    skipCancel: false,
  };

  render() {
    const {
      onCancel,
      onOk,
      okDisabled,
      zoom,
      okLabel,
      submit,
      skipCancel,
    } = this.props;
    return (
      <div className={cs('EntityActionButtons', {zoom})}>
        <div className="EntityActionButtons__inner">
          {!skipCancel && <Button name="cancel" onClick={onCancel}>Cancel</Button>}
          <Button
            name="submit"
            type={submit ? 'submit' : undefined}
            disabled={okDisabled}
            onClick={onOk}
          >
            {okLabel}
          </Button>
        </div>
      </div>
    );
  }
}
