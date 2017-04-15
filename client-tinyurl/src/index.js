import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './views/App';
import UrlCatalog from './views/UrlCatalog';
import './index.css';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={App} >
      <Route path='/catalog' components={{ content: UrlCatalog }} />
    </Route>
  </Router>,
  document.getElementById('root')
);