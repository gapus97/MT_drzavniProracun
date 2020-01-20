import { createGlobalStyle } from 'styled-components';

export const darkTheme = {
    body: '#363537',
    text: '#FAFAFA',
    toggleBorder: '#6B8096',
    gradient: 'linear-gradient(#091236, #1E215D)',
    sectionArea: '#313131',
    sectionAreaChild: '#414141'
};

export const barChartColors = {
  minValue: "#Ca3e47",
  centerValue: 'white',
  maxValue: 'green'
};

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  body {
    align-items: center;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    /*display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;*/
    margin: 0;
    padding: 0;
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    transition: all 0.25s linear;
    }`;