import React from 'react';
import './App.css';
//import 'leaflet/dist/leaflet.css';
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

      <footer className="footer">
        <div>
          <p>This app uses data from <a href="https://www.e-prostor.gov.si/">e-prostor gov </a></p>
        </div>
      </footer>
    </div>
  );
}

export default App;
