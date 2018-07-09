import {diff} from 'just-diff';
import {actions} from './actions';
import {addSystemDefcon1} from './systemDefcon1';
import ProjectService from '../services/ProjectService';
import LoginManager from '../utils/auth';
import userStorage from '../utils/userStorage';
import {updateEntitiesStatues} from './';

let prevData;

const showSavedMessage = dispatch => dispatch(actions.addSystemInformationMessage({
  type: 'success',
  message: 'All data has been synced with API',
}));

export const loadFromServer = () => async (dispatch, getState) => {
  dispatch(actions.setLoadingProject(true));
  dispatch(actions.setLoadedProject(false));
  const {onAppLoad, onProjectSave} = getState().plugins;
  try {
    const responses = await Promise.all(onAppLoad.map(item => item.request()));
    onAppLoad.map((item, idx) => dispatch(item.callback(responses[idx])));
    onAppLoad.map((item, idx) => {
      item.action && dispatch(item.action(responses[idx]));
      item.actions && item.actions.map(action => dispatch(action(responses[idx])));
    });
    const connections = responses[0].body.connections
      .map(({fromId, toId}) => ({fromId, toId}));
    prevData = {
      ...onProjectSave.reduce((map, item) => ({...map, ...item(getState(), {isForDiff: true})}), {}),
      connections,
    };
    // console.log('INIT prevData', prevData);
  } catch (error) {
    if (error.statusCode === 401) {
      LoginManager().refreshLogin();
    } else {
      dispatch(addSystemDefcon1({error}));
    }
  }
  dispatch(actions.setLoadingProject(false));
  dispatch(actions.setLoadedProject(true));
  dispatch(updateEntitiesStatues());
};

export const saveToServer = (opts) => async (dispatch, getState) => {
  dispatch(actions.setLoadingProject(true));
  const options = Object.assign({
    showMessage: true,
    saveProject: true,
  }, opts);
  const {showMessage, saveProject} = options;
  const state = getState();
  const {onProjectSave, onBeforeProjectSave} = state.plugins;
  const currData = onProjectSave.reduce((map, item) => ({
    ...map,
    ...item(state, {...options, isForDiff: true}),
  }), {});
  const data = onProjectSave.reduce((map, item) => ({...map, ...item(state, options)}), {});
  const delta = diff(prevData, currData);
  // if (delta.length === 0) {
  //   console.log('NO CHANGE', delta, currData, prevData);
  //   setTimeout(() => {
  //     dispatch(actions.setLoadingProject(false));
  //     showSavedMessage(dispatch);
  //   }, 100);
  //   return;
  // }
  const onSaves = onBeforeProjectSave.reduce((map, item) => [...map, ...item(state)], []);
  if (onSaves.length > 0) {
    try {
      await Promise.all(onSaves.map(item => item.onSave(state, delta, currData, prevData)));
    } catch (error) {
      dispatch(addSystemDefcon1({error}));
    }
  }
  try {
    if (saveProject) {
      await ProjectService.save(data);
    }
    prevData = currData;
  } catch (error) {
    if (error.statusCode === 401) {
      LoginManager().refreshLogin();
    } else {
      dispatch(addSystemDefcon1({error}));
    }
  }
  if (showMessage) {
    showSavedMessage(dispatch);
  }
  dispatch(actions.setLoadingProject(false));
};

export const clearServer = () => async (dispatch, getState) => {
  const state = getState();
  const {onProjectClear, onProjectSave} = state.plugins;
  dispatch(actions.clearProject());
  userStorage.remove('zoomWindow');
  userStorage.remove('entityCollapsed');
  try {
    await ProjectService.clearProject();
    if (onProjectClear.length > 0) {
      try {
        await Promise.all(onProjectClear.map(action => dispatch(action())));
      } catch (error) {
        dispatch(addSystemDefcon1({error}));
      }
    }
  } catch (error) {
    if (error.statusCode === 401) {
      LoginManager().refreshLogin();
    } else {
      dispatch(addSystemDefcon1({error}));
    }
  }
  prevData = onProjectSave.reduce((map, item) => ({
    ...map,
    ...item(state, {isForDiff: true}),
  }), {});
  dispatch(actions.addSystemInformationMessage({
    type: 'success',
    message: 'All data removed from server',
  }));
  dispatch(actions.setLoadingProject(false));
};

export const saveOrder = orderedIds => (dispatch, getState) => {
  getState().plugins.onSaveOrder.forEach(action => dispatch(action(orderedIds)));
};

export const logout = () => () => {
  LoginManager().logout();
};
