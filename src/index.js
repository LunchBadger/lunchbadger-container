/*eslint no-console:0 */
// entry for app...
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {setGAUserId} from '../plugins/lunchbadger-ui/src';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/lunchbadger.css';

console.info('LBAPP VERSION 0.306', [
  'Feature/570 Animate swapping of entities in canvas #1047',
  'Feature/351 Suggested improvements to Settings Panel #1046',
  'Feature/1040 Show validation message for model property #1045',
  'Feature/901 ignorePath option in EG for functions is no longer required #1028',
  'Feature/708 Autoscroll quadrant on making connection #1044',
  'Bugfix/1039 Unable connect model-datasource on walkthrough #1043',
  'Feature/441 Get rid of react-ace editor warnings part 2 #1042',
  'Feature/1035 zoom window buttons #1041',
  'Feature/1032 model property default value must match its type #1038',
  'Feature/1036 get rid of $blockScrolling error',
  'Feature/548 Forecaster launch rethink #1034',
  'Feature/450 all lb models have default empty value #1033',
  'Bugfix/934 checkbox not working on safari #1031',
  'Feature/453 Autogenerated endpoint name should always be unique #1030',
  'Feature/955 Silent update walkthrough #1029',
  'Bugfix/1026 Error Cannot read property toLowerCase of undefined in GatewayProxyServiceEndpoint #1027',
  'Bugfix/1020 OK button disabled when custom property value is changed #1025',
  'Feature/1023 add connector specific parameters #1024',
  'Feature/1019 Handle KubeWatcher v2 #1022',
  'Feature/911 mongodb connector needs more flexibility #1021'
]);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans',
  palette: {
    primary1Color: '#4190cd',
    accent1Color: '#047C99'
  }
});

const AppLoader = LunchBadgerCore.components.AppLoader;
const storeReducers = LunchBadgerCore.utils.storeReducers;
LunchBadgerCore.multiEnvIndex = 0;

const loginManager = LunchBadgerCore.utils.createLoginManager();

loginManager.checkAuth().then(loggedIn => {
  if (!loggedIn) return;
  const {id_token, profile} = loginManager.user;
  setGAUserId(profile.sub);
  global.ID_TOKEN = id_token; // FIXME: quick and dirty fix for urgent demo
  let middleware = compose(applyMiddleware(thunk));
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middleware = compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  const store = createStore(storeReducers(), middleware);
  LunchBadgerCore.services.ConfigStoreService.initialize();
  LunchBadgerCore.services.ProjectService.initialize();
  LunchBadgerCore.services.KubeWatcherService.initialize();
  LunchBadgerCore.services.SshManagerService.initialize();
  (store.getState().plugins.services || []).map(service => service.initialize());
  LunchBadgerCore.isMultiEnv = document.location.search === '?multi';

  // Render the main component into the dom
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <AppLoader />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
  );
});
