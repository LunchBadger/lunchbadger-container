import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {connect} from 'react-redux';
import {ContextualInformationMessage} from '../';
import './TooltipWrapper.scss';

const TooltipWrapper = ({content, left, top}) => (
  <div className={cs('TooltipWrapper', {visible: content !== null})} style={{left, top}}>
    <ContextualInformationMessage direction="right" width={210}>
      {content}
    </ContextualInformationMessage>
  </div>
);

const mapStateToProps = ({ui: {tooltip: {content, left, top}}}) => ({
  content,
  left,
  top,
});

export default connect(mapStateToProps)(TooltipWrapper);
