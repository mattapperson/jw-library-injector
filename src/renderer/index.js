import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'unstated';
import { composeLibs } from './libs';
import './styles/main.scss'
composeLibs();

import Index from './pages/index.js';
import { HashRouter } from 'react-router-dom';
ReactDOM.render(
  <Provider>
    <HashRouter>
      <Index />
    </HashRouter>
  </Provider>,
  document.getElementById('app')
);
