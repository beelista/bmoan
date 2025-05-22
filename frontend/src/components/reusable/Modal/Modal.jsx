import React from 'react';
import './Modal.css';

export default function CuteModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-message-scroll">
          <div className="modal-message">{children}</div>
        </div>
        <div className="modal-buttons">
          <button className="modal-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
