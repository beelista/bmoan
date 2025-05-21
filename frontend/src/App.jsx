import { useState } from 'react';
import CandyBackground from './CandyBackground';
import './App.css';

function Modal({ message, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <p className="modal-message">{message}</p>
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    complaint: '',
    mood: null
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

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
    if (!formData.name.trim()) newErrors.name = 'Please fill out this field';
    if (!formData.email.trim()) newErrors.email = 'Please fill out this field';
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email';
    }
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
    setFormData({ name: '', email: '', complaint: '', mood: null });
    setErrors({});
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      <CandyBackground />
      <div className="app-container">
        <h1 className="main-title">Bitch & Moan</h1>
        <form className="complaint-form" onSubmit={handleSubmit} noValidate>

          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} aria-describedby="nameError" />
          {errors.name && <div id="nameError" className="error-message">{errors.name}</div>}

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} aria-describedby="emailError" />
          {errors.email && <div id="emailError" className="error-message">{errors.email}</div>}

          <textarea name="complaint" placeholder="What's on your mind lil bro?" value={formData.complaint} onChange={handleChange} rows="5" aria-describedby="complaintError" />
          {errors.complaint && <div id="complaintError" className="error-message">{errors.complaint}</div>}

          <label className="mood-label">How are we feeling today?</label>
          <div className="mood-selector" role="radiogroup" aria-labelledby="moodLabel">
            {[1, 2, 3, 4, 5].map(num => (
              <img key={num} src={`/${num}.png`} alt={`Mood ${num}`} className={`mood-img ${formData.mood === num ? 'selected' : ''}`} onClick={() => handleMoodClick(num)} role="radio" aria-checked={formData.mood === num} tabIndex={0}
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
              Alright! <br/>
              <br />
              Don't worry, your rant was entirely encrypted end-to-end so I won't be able to read it even if I wanted to. <br />
              <br />
              Keep a tab on your mail for something tasty soon :P
            </>
          }
          onClose={closeModal}
        />
      )}

    </>
  );
}

export default App;
