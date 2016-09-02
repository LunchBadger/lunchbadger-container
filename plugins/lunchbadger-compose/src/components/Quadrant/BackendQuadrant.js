import React, {Component, PropTypes} from 'react';
import DataSource from '../CanvasElements/DataSource';
import updateOrder from 'actions/Quadrants/Backend/updateOrder';

const Quadrant = LunchBadgerCore.components.Quadrant;

class BackendQuadrant extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    entities: PropTypes.array,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  renderEntities() {
    return this.props.entities.map((entity) => {
      return <DataSource paper={this.props.paper}
                         appState={this.props.appState}
                         key={entity.id}
                         icon="icon-icon-datasource"
                         hideSourceOnDrag={true}
                         itemOrder={entity.itemOrder}
                         moveEntity={this.moveEntity}
                         entity={entity}/>;
    })
  }

  moveEntity(entity, itemOrder, hoverOrder) {
    updateOrder(entity, itemOrder, hoverOrder);
  }

  render() {
    return (
      <div className="quadrant__body">
        {this.renderEntities()}
      </div>
    );
  }
}

export default Quadrant(BackendQuadrant);
