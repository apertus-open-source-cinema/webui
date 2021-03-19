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
      <App />
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
);
