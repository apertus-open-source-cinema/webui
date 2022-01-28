// SPDX-FileCopyrightText: © 2019 Jaro Habiger <jarohabiger@googlemail.com>
// SPDX-License-Identifier: AGPL-3.0-only

import * as React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { HashRouter as Router } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core';
import { amber, green } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FA8756',
      contrastText: '#FFFFFF',
    },
    secondary: green,
  },
});

ReactDOM.render(
  <Router>
    <ThemeProvider theme={theme}>
      <App theme={theme} />
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
);
