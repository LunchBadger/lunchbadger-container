import {actions} from './actions';
import _ from 'lodash';
import Gateway from '../models/Gateway';
import Pipeline from '../models/Pipeline';
import initialPipelinePolicies from '../utils/initialPipelinePolicies';
// import Policy from '../models/Policy';

const {Connections} = LunchBadgerCore.stores;
const {coreActions, actions: actionsCore} = LunchBadgerCore.utils;

export const add = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[2].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const pipelines = {Pipeline: {policies: initialPipelinePolicies}};
  const entity = Gateway.create({name: 'Gateway', itemOrder, loaded: false, pipelines});
  dispatch(actions.updateGateway(entity));
  return entity;
}

export const update = (entity, model) => async (dispatch, getState) => {
  const state = getState();
  const index = state.multiEnvironments.selected;
  let updatedEntity;
  if (index > 0) {
    updatedEntity = Gateway.create({...entity.toJSON(), ...model});
    dispatch(actionsCore.multiEnvironmentsUpdateEntity({index, entity: updatedEntity}));
    return updatedEntity;
  }
  const removedPipelines = _.difference(
    entity.pipelines.map(p => p.id),
    (model.pipelines || []).map(p => p.id),
  );
  removedPipelines.forEach((id) => {
    Connections.removeConnection(id);
    Connections.removeConnection(null, id);
  });
  // (model.pipelines || []).forEach(({name, id, policies}) => {
  //   if (policies.filter(policy => !!policy.proxy).length === 0) {
  //     console.log('Del conns', name, id, policies);
  //     Connections.removeConnection(id);
  //     Connections.removeConnection(null, id);
  //   }
  // });
  updatedEntity = Gateway.create({...entity.toJSON(), ...model, loaded: entity.loaded, ready: false});
  dispatch(actions.updateGateway(updatedEntity));
  await dispatch(coreActions.saveToServer());
  updatedEntity = updatedEntity.recreate();
  updatedEntity.ready = true;
  updatedEntity.loaded = true;
  dispatch(actions.updateGateway(updatedEntity));
  dispatch(actionsCore.addSystemInformationMessage({
    type: 'success',
    message: 'Gateway successfully deployed',
  }));
  return updatedEntity;
};

export const remove = entity => async (dispatch) => {
  entity.pipelines.forEach(({id}) => {
    Connections.removeConnection(id);
    Connections.removeConnection(null, id);
  });
  dispatch(actions.removeGateway(entity));
  await dispatch(coreActions.saveToServer());
};

export const saveOrder = orderedIds => (dispatch, getState) => {
  const entities = getState().entities.gateways;
  const reordered = [];
  orderedIds.forEach((id, idx) => {
    if (entities[id] && entities[id].itemOrder !== idx) {
      const entity = entities[id].recreate();
      entity.itemOrder = idx;
      reordered.push(entity);
    }
  });
  if (reordered.length > 0) {
    dispatch(actions.updateGateways(reordered));
  }
};

export const addPipeline = gatewayId => (dispatch, getState) => {
  const entity = getState().entities.gateways[gatewayId].recreate();
  entity.addPipeline(Pipeline.create({name: 'Pipeline'}));
  dispatch(actions.updateGateway(entity));
}

export const removePipeline = (gatewayId, pipeline) => (dispatch, getState) => {
  const entity = getState().entities.gateways[gatewayId].recreate();
  const {id} = pipeline;
  Connections.removeConnection(id);
  Connections.removeConnection(null, id);
  entity.removePipeline(pipeline);
  dispatch(actions.updateGateway(entity));
}
