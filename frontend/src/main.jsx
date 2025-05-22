// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Rant from './components/pages/Rant/Rant';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />        {/* Landing page */}
        <Route path="/rant" element={<Rant />} />
        {/* Optionally add a home or 404 page here */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
