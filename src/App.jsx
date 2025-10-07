import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import GuidelinesApp from './pages/guidelines/Guidelines';
import MoreGuides from './pages/guidelines/MoreGuides';
import Trading from './pages/trading/Trading';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guidelines" element={<GuidelinesApp />} />
          <Route path="/guidelines/more" element={<MoreGuides />} />
          <Route path="/trading" element={<Trading />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
