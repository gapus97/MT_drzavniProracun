import React from 'react';
import './App.css';
import Routes from './Router';
import { ThemeProvider } from 'styled-components';
import { darkTheme, GlobalStyles } from './utils/StyleUtils';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles />
        <div className="App">
          <Routes />
        </div>
    </ThemeProvider>
  );
}

export default App;
