import React from 'react';
import './App.css';
import States from './components/States';
import BarChart from './components/charts/BarChart';
import Main from './sites/Main';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Header</p>
        <States />
        <BarChart />
      </header>

      <Main />

    </div>
  );
}

export default App;
