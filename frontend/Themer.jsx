import React, { useState } from 'react';
import { createMuiTheme } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/core/styles';
import { App } from './App';

export default function Themer() {
  const [isDark, setDark] = useState(false);
  function changeTheme() {
    setDark(!isDark);
  }
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#FA8756',
        contrastText: '#ffffff',
      },
      secondary: green,
      type: isDark ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <App isDark={isDark} changeTheme={changeTheme} />
    </ThemeProvider>
  );
}
