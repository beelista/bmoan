import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CandyBackground from '../../backgrounds/CandyBackground/CandyBackground';
import './Rant.css';

function Modal({ message, onClose, onBackHome }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button className="modal-btn" onClick={onBackHome}>Back to Home</button>
          <button className="modal-btn" onClick={onClose}>Whine More</button>
        </div>
      </div>
    </div>
  );
}

function Rant() {
  const [formData, setFormData] = useState({
    complaint: '',
    mood: null
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [doorHovered, setDoorHovered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleMoodClick = (moodValue) => {
    setFormData(prev => ({ ...prev, mood: moodValue }));
    setErrors(prev => ({ ...prev, mood: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.complaint.trim()) newErrors.complaint = 'Please fill out this field';
    if (!formData.mood) newErrors.mood = 'Please pick a mood';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log('Submitted Complaint:', formData);
    setShowModal(true);
    setFormData({ complaint: '', mood: null });
    setErrors({});
  };

  const closeModal = () => setShowModal(false);
  const goHome = () => navigate('/');

  return (
    <>
      <CandyBackground />
      <div className="app-container">
        <div className="header-container">
          <Link to="/" className="door-link">
            <img
              src={doorHovered ? '/door_open.png' : '/door_closed.png'}
              alt="Exit door"
              className="door-icon"
              onMouseEnter={() => setDoorHovered(true)}
              onMouseLeave={() => setDoorHovered(false)}
            />
          </Link>
          <h1 className="main-title">Crash Out</h1>
        </div>

        <form className="complaint-form" onSubmit={handleSubmit} noValidate>

          <textarea
            name="complaint"
            placeholder="What's on your mind lil bro?"
            value={formData.complaint}
            onChange={handleChange}
            rows="5"
            aria-describedby="complaintError"
          />
          {errors.complaint && <div id="complaintError" className="error-message">{errors.complaint}</div>}

          <label className="mood-label" id="moodLabel">How are we feeling today?</label>
          <div className="mood-selector" role="radiogroup" aria-labelledby="moodLabel">
            {[5, 4, 3, 2, 1].map(num => (
              <img
                key={num}
                src={`/${num}.png`}
                alt={`Mood ${num}`}
                className={`mood-img ${formData.mood === num ? 'selected' : ''}`}
                onClick={() => handleMoodClick(num)}
                role="radio"
                aria-checked={formData.mood === num}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMoodClick(num);
                  }
                }}
              />
            ))}
          </div>

          {errors.mood && <div className="error-message">{errors.mood}</div>}

          <button type="submit">Submit</button>
        </form>
      </div>

      {showModal && (
        <Modal
          message={
            <>
              Alright! <br /><br />
              Don't worry, this rant isn't being stored anywhere. It's prolly already been turned to fairy dust by now. <br /><br />
              Hope you feel better (or worse ¬.¬) soon!
            </>
          }
          onClose={closeModal}
          onBackHome={goHome}
        />
      )}
    </>
  );
}

export default Rant;
