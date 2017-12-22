import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import './CanvasElement.scss';
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import _ from 'lodash';
import {
  setCurrentElement,
  clearCurrentElement,
  setCurrentEditElement,
  setCurrentZoom,
} from '../../reduxActions';
import {actions} from '../../reduxActions/actions';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import {Entity} from '../../../../lunchbadger-ui/src';
import getFlatModel from '../../utils/getFlatModel';

const boxSource = {
  beginDrag: (props) => {
    const {entity, id, itemOrder} = props;
    return {entity, id, itemOrder};
  },
  canDrag: (props) => {
    return !props.editable;
  }
};

const boxTarget = {
  hover: _.debounce((props, monitor, component) => {
    const item = monitor.getItem();
    if (!item) return;
    const dragIndex = item.itemOrder;
    const hoverIndex = props.itemOrder;
    if (props.isPanelOpened) return;
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const clientOffset = monitor.getClientOffset();
    if (dragIndex < hoverIndex && clientOffset.y < hoverBoundingRect.bottom - 15) return;
    if (dragIndex > hoverIndex && clientOffset.y > hoverBoundingRect.top + 15) return;
    if (item.subelement) return;
    props.moveEntity(item.id, dragIndex || 0, hoverIndex || 0);
  }, 300),

  canDrop(props, monitor) {
    const item = monitor.getItem();
    return _.includes(props.entity.accept, item.entity.constructor.type);
  },

  drop(props, monitor, component) {
    const item = monitor.getItem();
    const element = component.element.decoratedComponentInstance || component.element;
    if (props.isPanelOpened) {
      return;
    }
    if (typeof element.onDrop === 'function') {
      setTimeout(() => element.onDrop(item));
    }
  }
};

@DragSource('canvasElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

@DropTarget('canvasElement', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))

export default (ComposedComponent) => {
  class CanvasElement extends PureComponent {
    static propTypes = {
      entity: PropTypes.object.isRequired,
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired,
      itemOrder: PropTypes.number,
      isOver: PropTypes.bool,
      canDrop: PropTypes.bool
    };

    constructor(props) {
      super(props);
      this.state = {
        showRemovingModal: false,
        validations: {
          isValid: true,
          data: {}
        },
      };
    }

    componentWillReceiveProps(props) {
      this._handleDrop(props);
      if (props.entity !== this.props.entity) {
        setTimeout(this.setFlatModel);
      }
    }

    componentDidMount() {
      this.setFlatModel();
    }

    setFlatModel = () => {
      if (this.entityRef) {
        this.state.model = getFlatModel(this.entityRef.getFormRef().getModel());
      }
    }

    refresh = () => {
      this.forceUpdate();
    }

    update = async (props) => {
      const {entity, dispatch} = this.props;
      let model = props;
      const element = this.element.decoratedComponentInstance || this.element;
      if (typeof element.processModel === 'function') {
        model = element.processModel(model);
      }
      const validations = dispatch(entity.validate(model));
      this.setState({validations});
      if (!validations.isValid) return;
      dispatch(setCurrentEditElement(null));
      const updatedEntity = await dispatch(entity.update(model));
      dispatch(setCurrentElement(updatedEntity));
      setTimeout(() => {
        if (this.entityRef && this.entityRef.getFormRef()) {
          this.setFlatModel();
        }
      });
    }

    updateName = (evt) => {
      const element = this.element.decoratedComponentInstance || this.element;
      if (typeof element.updateName === 'function') {
        element.updateName(evt);
      }
    }

    triggerElementAutofocus() {
      if (!this.entityRef) return; // FIXME
      const nameInput = findDOMNode(this.entityRef.getInputNameRef());
      const selectAllOnce = () => {
        nameInput.select();
        nameInput.removeEventListener('focus', selectAllOnce);
      };
      nameInput.addEventListener('focus', selectAllOnce);
      nameInput.focus();
    }

    _focusClosestInput(target) {
      const closestProperty = target.closest('.EntityProperty__field');
      const closestPropertyInput = closestProperty && closestProperty.querySelector('input');
      const closestElement = target.closest('.Entity');
      const closestInput = closestElement.querySelector('input');
      if (closestPropertyInput) {
        closestPropertyInput.select();
      } else if (closestInput) {
        closestInput.select();
      }
    }

    _handleDrop(props) {
      if (this.props.isDragging && !props.isDragging && props.saveOrder) {
        props.saveOrder();
      }
    }

    handleRemove = () => {
      const {entity, dispatch} = this.props;
      dispatch(entity.remove());
      dispatch(actions.removeEntity(entity));
      dispatch(clearCurrentElement());
    }

    handleEdit = (event) => {
      const {dispatch, multiEnvIndex, multiEnvDelta} = this.props;
      if (multiEnvDelta && multiEnvIndex > 0) {
        event.stopPropagation();
        return;
      }
      dispatch(setCurrentEditElement(this.props.entity));
      event.stopPropagation();
    }

    handleZoom = tab => (event) => {
      const elementDOMRect = findDOMNode(this.entityRef).getBoundingClientRect();
      const {x, y, width, height} = elementDOMRect;
      const rect = {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
        tab,
      };
      this.props.dispatch(setCurrentZoom(rect));
      event.stopPropagation();
    };

    resetFormModel = () => {
      if (this.entityRef.getFormRef()) {
        this.entityRef.getFormRef().reset(this.state.model);
      }
    }

    handleCancel = (event) => {
      event.persist();
      const {entity, dispatch} = this.props;
      if (!entity.loaded) {
        dispatch(entity.remove());
        dispatch(actions.removeEntity(entity));
        dispatch(clearCurrentElement());
      } else {
        if (!this.state.isValid) {
          this.setState({validations: {isValid: true, data: {}}});
        }
        const element = this.element.decoratedComponentInstance || this.element;
        if (typeof element.discardChanges === 'function') {
          element.discardChanges(() => setTimeout(this.resetFormModel));
        } else {
          this.resetFormModel();
        }
      }
      dispatch(setCurrentEditElement(null));
      event.preventDefault();
      event.stopPropagation();
    }

    handleFieldUpdate = (field, value) => {
      const data = Object.assign({}, this.state.validations.data);
      if (data[field] && value !== '') {
        delete data[field];
      }
      const isValid = Object.keys(data).length === 0;
      this.setState({validations: {isValid, data}});
    }

    handleValidationFieldClick = field => ({target}) => {
      const closestCanvasElement = target.closest('.Entity');
      const closestInput = closestCanvasElement && closestCanvasElement.querySelector(`#${field}`);
      if (closestInput) {
        closestInput.focus();
      }
    }

    handleResetMultiEnvEntity = () => {
      const {multiEnvIndex: index, entity, dispatch} = this.props;
      dispatch(actions.multiEnvironmentsUpdateEntity({index, entity}));
    }

    handleResetMultiEnvEntityField = field => () => {
      const {multiEnvIndex: index, entity: {id, [field]: value}, dispatch} = this.props;
      dispatch(actions.multiEnvironmentsResetEntityField({index, id, field, value}));
    }

    handleClick = (event) => {
      const {entity, dispatch} = this.props;
      dispatch(setCurrentElement(entity));
      event.stopPropagation();
    }

    propertiesMapping = key => ['_pipelines'].includes(key) ? key.replace(/_/, '') : key;

    render() {
      const {
        entity,
        connectDragSource,
        connectDropTarget,
        isDragging,
        editable,
        highlighted,
        multiEnvIndex,
        multiEnvDelta,
        multiEnvEntity,
        nested,
      } = this.props;
      if (nested) return (
        <ComposedComponent
          ref={(ref) => this.element = ref}
          parent={this}
          {...this.props}
          {...this.state}
          entity={multiEnvEntity}
          entityDevelopment={entity}
          onFieldUpdate={this.handleFieldUpdate}
          onResetField={this.handleResetMultiEnvEntityField}
          multiEnvIndex={multiEnvIndex}
        />
      );
      const {ready, isZoomDisabled} = entity;
      const processing = !ready;
      const {validations} = this.state;
      let isDelta = entity !== multiEnvEntity;
      const toolboxConfig = [];
      const tabs = entity.tabs || [];
      if (multiEnvDelta) {
        if (isDelta) {
          toolboxConfig.push({
            action: 'delete',
            icon: 'iconRevert',
            onClick: this.handleResetMultiEnvEntity,
            label:'Revert changes',
          });
        }
      } else {
        if (multiEnvIndex === 0) {
          toolboxConfig.push({
            action: 'delete',
            icon: 'iconTrash',
            onClick: () => this.setState({showRemovingModal: true}),
            label: 'Remove',
          });
        }
        if (!isZoomDisabled) {
          toolboxConfig.push({
            action: 'zoom',
            icon: 'iconBasics',
            onClick: this.handleZoom('general'),
            label: 'Details',
          });
          tabs.forEach(({name, icon, label}) => {
            toolboxConfig.push({
              action: name,
              icon,
              onClick: this.handleZoom(name),
              label,
            });
          });
        }
        toolboxConfig.push({
          action: 'edit',
          icon: 'iconEdit',
          onClick: this.handleEdit,
          label: 'Edit',
        });
      }
      return (
            <Entity
              ref={(r) => {this.entityRef = r}}
              type={this.props.entity.constructor.type}
              connector={this.props.entity.constructor.type === 'DataSource' ? this.props.entity.connector : undefined}
              editable={editable}
              highlighted={highlighted}
              dragging={isDragging}
              wip={processing}
              invalid={!validations.isValid}
              toolboxConfig={toolboxConfig}
              name={this.props.entity.name}
              onNameChange={this.updateName}
              onNameBlur={this.handleFieldUpdate}
              onCancel={this.handleCancel}
              validations={validations}
              onFieldClick={this.handleValidationFieldClick}
              onValidSubmit={this.update}
              onClick={this.handleClick}
              onDoubleClick={this.handleEdit}
              connectDragSource={connectDragSource}
              connectDropTarget={connectDropTarget}
              isDelta={isDelta}
            >
              <ComposedComponent
                ref={(ref) => this.element = ref}
                parent={this}
                {...this.props}
                {...this.state}
                entity={multiEnvEntity}
                entityDevelopment={entity}
                onFieldUpdate={this.handleFieldUpdate}
                onResetField={this.handleResetMultiEnvEntityField}
                multiEnvIndex={multiEnvIndex}
              />
              {this.state.showRemovingModal && (
                <TwoOptionModal
                  onClose={() => this.setState({showRemovingModal: false})}
                  onSave={this.handleRemove}
                  onCancel={() => this.setState({showRemovingModal: false})}
                  title="Remove entity"
                  confirmText="Remove"
                  discardText="Cancel"
                >
                  <span>
                    Do you really want to remove that entity?
                  </span>
                </TwoOptionModal>
              )}
            </Entity>
      );
    }
  }

  const connector = createSelector(
    state => state.multiEnvironments,
    state => state.states.currentElement,
    state => state.states.currentEditElement,
    state => !!state.states.currentlyOpenedPanel,
    (_, props) => props.entity,
    (
      multiEnvironments,
      currentElement,
      currentEditElement,
      isPanelOpened,
      entity,
    ) => {
      const {id} = entity;
      const multiEnvIndex = multiEnvironments.selected;
      const multiEnvDelta = multiEnvironments.environments[multiEnvIndex].delta;
      let multiEnvEntity = entity;
      if (multiEnvIndex > 0 && multiEnvironments.environments[multiEnvIndex].entities[id]) {
        multiEnvEntity = multiEnvironments.environments[multiEnvIndex].entities[id];
      }
      const highlighted = !!currentElement && currentElement.id === id;
      const editable = !!currentEditElement && currentEditElement.id === id;
      return {
        multiEnvIndex,
        multiEnvDelta,
        multiEnvEntity,
        isPanelOpened,
        highlighted,
        editable,
      };
    },
  );

  return connect(connector, null, null, {withRef: true})(CanvasElement);
}
