import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';

const diamondOptions = [
  { id: 1, amount: 60, price: '$0.99' },
  { id: 2, amount: 300, price: '$4.99' },
  { id: 3, amount: 600, price: '$9.99' },
  { id: 4, amount: 1200, price: '$19.99' }
];

const Step2_Quantity = ({ formData, setFormData, nextStep, prevStep }) => {
  const handleChange = (amount) => {
    setFormData({ ...formData, quantity: amount });
  };

  return (
    <div className="step-container step2-container">
      <h2 className="step-title">Select Diamond Amount</h2>
      
      <div className="diamond-options">
        {diamondOptions.map((option) => (
          <div 
            key={option.id}
            className={`diamond-option ${formData.quantity === option.amount ? 'selected' : ''}`}
            onClick={() => handleChange(option.amount)}
          >
            <div className="diamond-icon">
              <FontAwesomeIcon icon={faGem} />
            </div>
            <div className="diamond-amount">{option.amount} Diamonds</div>
            <div className="diamond-price">{option.price}</div>
          </div>
        ))}
      </div>
      
      <div className="buttons-container">
        <button className="btn step-button-secondary" onClick={prevStep}>
          Back
        </button>
        <button 
          className="btn btn-primary step-button"
          onClick={nextStep}
          disabled={!formData.quantity}
        >
          Next
        </button>
      </div>

      <style jsx>{`
        .step-container {
          max-width: 600px;
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

        .diamond-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .diamond-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: rgba(0, 0, 0, 0.2);
          border: 2px solid rgba(138, 43, 226, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .diamond-option:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 0 15px rgba(138, 43, 226, 0.5);
          border-color: rgba(138, 43, 226, 0.6);
        }

        .diamond-option.selected {
          border-color: var(--accent-color);
          box-shadow: 0 0 15px rgba(138, 43, 226, 0.5);
          background-color: rgba(138, 43, 226, 0.15);
        }

        .diamond-icon {
          font-size: 2rem;
          margin-bottom: 10px;
          color: var(--accent-color);
        }

        .diamond-amount {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .diamond-price {
          color: #aaa;
        }

        .buttons-container {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-top: 20px;
        }

        .buttons-container .btn {
          flex: 1;
          padding: 12px;
        }

        .step-button-secondary {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: #ccc;
        }

        .step-button-secondary:hover {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          color: #fff;
        }

        @media (max-width: 600px) {
          .diamond-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Step2_Quantity; 