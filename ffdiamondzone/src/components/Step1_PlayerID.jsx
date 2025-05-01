import React, { useState } from 'react';

const Step1_PlayerID = ({ formData, setFormData, nextStep }) => {
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, playerId: value });

    // Basic validation feedback
    if (value && !/^[0-9]{8,10}$/.test(value)) {
      setError('Player ID must be 8-10 digits.');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Final check before proceeding
    if (/^[0-9]{8,10}$/.test(formData.playerId)) {
      setError('');
      nextStep();
    } else {
      setError('Player ID must be 8-10 digits.');
    }
  };

  const isValid = formData.playerId && /^[0-9]{8,10}$/.test(formData.playerId);

  return (
    <div className="step-container step1-container">
      <h2 className="step-title">Enter Your Player ID</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playerId">Player ID</label>
          <input
            type="text" // Keep as text to allow pattern matching
            id="playerId"
            name="playerId"
            value={formData.playerId}
            onChange={handleChange}
            placeholder="Enter your 8-10 digit Player ID"
            required
            className={`input-field ${error ? 'input-error' : ''}`}
            pattern="^[0-9]{8,10}$" // Regex validation
            title="Player ID must be 8-10 digits."
            minLength="8" // Optional: reinforces length
            maxLength="10" // Optional: reinforces length
            inputMode="numeric" // Hint for mobile keyboards
          />
          {error && <p className="error-message">{error}</p>}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary step-button"
          disabled={!isValid} // Disable if not valid
        >
          Continue
        </button>
      </form>

      <style jsx>{`
        .step-container {
          max-width: 500px;
          width: 100%;
          margin: 0 auto;
          padding: 0;
          border-radius: 0;
          background-color: transparent;
          border: none;
          box-shadow: none;
        }

        .step-title {
          font-size: 1.8rem;
          text-align: center;
          margin-bottom: 30px;
          color: var(--accent-color);
        }

        .form-group {
          margin-bottom: 25px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .input-field {
          width: 100%;
          padding: 12px 15px;
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--accent-color);
          border-radius: var(--border-radius);
          color: white;
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .input-field:focus {
          outline: none;
          box-shadow: 0 0 8px rgba(138, 43, 226, 0.6);
          border-color: rgba(138, 43, 226, 0.8);
          background-color: rgba(0, 0, 0, 0.3);
        }

        .input-error {
          border-color: #ff4d4d; /* Red for error */
          box-shadow: 0 0 8px rgba(255, 77, 77, 0.6);
        }

        .input-error:focus {
          border-color: #ff3333; 
          box-shadow: 0 0 8px rgba(255, 51, 51, 0.7);
        }
        
        .error-message {
          color: #ff4d4d;
          font-size: 0.9rem;
          margin-top: 5px;
        }

        .step-button {
          margin-top: 10px;
          width: 100%;
          padding: 12px;
        }

        .step-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: var(--accent-color); /* Keep color but lower opacity */
          border-color: var(--accent-color);
        }
      `}</style>
    </div>
  );
};

export default Step1_PlayerID; 