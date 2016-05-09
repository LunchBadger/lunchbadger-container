import Connection from './Connection';
import ConnectionFactory from 'models/Connection';
import _ from 'lodash';

const {BaseStore} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;
const Publics = [];

class Public extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'UpdatePublicOrder':
          Publics.splice(action.itemOrder, 0, Publics.splice(action.hoverOrder, 1)[0]);
          this.setEntitiesOrder(Publics);
          this.emitChange();
          break;
        case 'AddPublicEndpoint':
          this._insertPublicEndpoint(action.endpoint);
          this.emitChange();
          break;
        case 'AddPublicEndpointAndConnect':
          const {endpoint} = action;
          this._insertPublicEndpoint(endpoint);
          Connection.addConnection(ConnectionFactory.create({
            fromId: action.sourceId,
            toId: endpoint.id,
            info: {
              source: action.outPort
            }
          }));
          this.emitChange();
          break;
        case 'RemovePublicEndpoint':
          Publics.splice(this.findEntityIndex(action.endpoint.id), 1);
          action.endpoint.remove();
          this.emitChange();
          break;
        case 'UpdatePublicEndpoint':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'BundleAPI':
          Publics.splice(this.findEntityIndex(action.endpoint.id), 1);
          action.api.addEndpoint(action.endpoint);
          this.emitChange();
          break;
        case 'UnbundleAPI':
          Publics.push(action.endpoint);
          action.api.removeEndpoint(action.endpoint);
          this.emitChange();
          break;
        case 'RebundleAPI':
          action.fromAPI.removeEndpoint(action.endpoint);
          action.toAPI.addEndpoint(action.endpoint);
          this.emitChange();
          break;
        case 'AddAPI':
          Publics.push(action.API);
          action.API.itemOrder = Publics.length - 1;
          this.emitChange();
          break;
        case 'UpdateAPI':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
      }
    });
  }

  getData() {
    return Publics;
  }

  findEntity(id) {
    return _.find(Publics, {id: id});
  }

  findEntityIndex(id) {
    return _.findIndex(Publics, {id: id});
  }

  _insertPublicEndpoint(endpoint) {
    endpoint.itemOrder = Publics.length;
    Publics.push(endpoint);
  }
}

export default new Public;
