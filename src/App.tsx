import React, { useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Main from './Main';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';
import lightGreen from '@material-ui/core/colors/lightGreen';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: blue,
          secondary: lightGreen,
        },
      }),
    [prefersDarkMode],
  );

  useEffect(() => {
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <Main />
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
