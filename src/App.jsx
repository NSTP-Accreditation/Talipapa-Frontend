import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import GuidelinesApp from './pages/guidelines/App';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guidelines" element={<GuidelinesApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
