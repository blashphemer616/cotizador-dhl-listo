
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Precios from './pages/Precios';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/precios" element={<Precios />} />
      </Routes>
    </Router>
  );
}

export default App;
