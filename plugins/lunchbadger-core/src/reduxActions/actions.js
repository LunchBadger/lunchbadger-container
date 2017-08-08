import actionsCreator from '../utils/actionsCreator';

const {actions, actionTypes} = actionsCreator(
  [
    'loadProject',
    'saveProject',
  ],
  [
    'removeEntity',
    'setStates',
    'onLoadProject',

    'addSystemDefcon1',
    'toggleSystemDefcon1',

    'setLoadingProject',

    'setPortDOMElement',

    'clearProject',

    'updateOrder',

    'addInitialConnections',
    'addConnection',
    'moveConnection',
    'removeConnection',
    'removeConnections',
  ],
);

export {
  actions,
  actionTypes,
};
