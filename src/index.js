// load plugins first
import 'plugins/lunch-badger-plugin-monitor';

// import rest of app
import 'core-js/fn/object/assign';
import 'jsplumb';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';

// Render the main component into the dom
ReactDOM.render(<App />, document.getElementById('app'));
