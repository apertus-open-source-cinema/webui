// SPDX-FileCopyrightText: © 2019 Jaro Habiger <jarohabiger@googlemail.com>
// SPDX-License-Identifier: AGPL-3.0-only

import * as React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { HashRouter as Router } from 'react-router-dom';
import { createTheme } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FA8756',
      contrastText: 'white',
    },
    secondary: green,
  },
});

ReactDOM.render(
  <Router>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
);
