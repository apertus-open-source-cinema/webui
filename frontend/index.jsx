import * as React from 'react';
import ReactDOM from 'react-dom';
import Themer from './Themer';
import { HashRouter as Router } from 'react-router-dom';
ReactDOM.render(
  <Router>
    <Themer />
  </Router>,
  document.getElementById('root')
);
