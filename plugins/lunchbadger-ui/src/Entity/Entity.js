import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import EntityHeader from './EntityHeader/EntityHeader';
import EntityValidationErrors from './EntityValidationErrors/EntityValidationErrors';
import EntityActionButtons from './EntityActionButtons/EntityActionButtons';
import {SmoothCollapse, Toolbox, Form} from '../';
import './Entity.scss';

class Entity extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    }
  }

  componentWillReceiveProps(props) {
    if (!this.props.editable && props.editable && !this.state.expanded) {
      this.setState({expanded: true});
    }
  }

  getInputNameRef = () => this.entityHeaderRef.getInputNameRef();

  getFormRef = () => this.refs.form;

  handleToggleExpand = () => this.setState({expanded: !this.state.expanded});

  render() {
    const {
      children,
      type,
      connector,
      editable,
      highlighted,
      dragging,
      wip,
      invalid,
      toolboxConfig,
      name,
      onNameChange,
      validations,
      onFieldClick,
      onCancel,
      onValidSubmit,
      onClick,
      onDoubleClick,
      connectDragSource,
      connectDropTarget,
    } = this.props;
    const opacity = dragging ? 0.2 : 1;
    const {expanded} = this.state;
    const collapsed = !expanded;
    return connectDragSource(connectDropTarget(
      <div
        className={cs('Entity', type, connector, {editable, expanded, collapsed, highlighted, dragging, wip, invalid})}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        style={{opacity}}
      >
        <Toolbox config={toolboxConfig} />
        <Form name="elementForm" ref="form" onValidSubmit={onValidSubmit}>
          <EntityHeader
            ref={(r) => {this.entityHeaderRef = r;}}
            type={type}
            onToggleExpand={this.handleToggleExpand}
            name={name}
            onNameChange={onNameChange}
          />
          <div className="Entity__data">
            <SmoothCollapse expanded={expanded} heightTransition="800ms ease">
              <div className="Entity__extra">
                <EntityValidationErrors
                  validations={validations}
                  onFieldClick={onFieldClick}
                />
                {children}
                <SmoothCollapse expanded={editable} heightTransition="800ms ease">
                  <EntityActionButtons onCancel={onCancel} />
                </SmoothCollapse>
              </div>
            </SmoothCollapse>
          </div>
        </Form>
      </div>
    ));
  }
}

Entity.propTypes = {
  children: PropTypes.node.isRequired,
  editable: PropTypes.bool.isRequired,
  highlighted: PropTypes.bool.isRequired,
  dragging: PropTypes.bool.isRequired,
  wip: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  toolboxConfig: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,
  validations: PropTypes.object.isRequired,
  onFieldClick: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onValidSubmit: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  connector: PropTypes.string,
};

export default Entity;
