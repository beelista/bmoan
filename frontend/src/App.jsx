import React from 'react';
import LandingStarsBackground from './components/backgrounds/StarStrip/StarStrip';
import './App.css';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      <LandingStarsBackground />

      <div className="landing-container">
        <div className="landing-content-box">
          <h1 className="landing-title">Welcome to the B&M Initiative</h1>
          <div className="button-group">
            <button
              className="landing-btn rave-btn"
              disabled // disables the button
              // onClick={() => navigate('/rave')} // removed because disabled
              style={{ cursor: 'not-allowed', opacity: 0.5 }} // visually indicate disabled
            >
              Rave
            </button>
            <button className="landing-btn rant-btn" onClick={() => navigate('/rant')}>
              Rant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
