import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const paymentMethodTranslationKeys = {
  mercadopago: 'form.paymentMethods.mercadopago',
  bank_transfer_ars: 'form.paymentMethods.bank_transfer_ars',
  stripe: 'form.paymentMethods.stripe',
  crypto: 'form.paymentMethods.crypto'
};

const Summary = ({ formData, prevStep }) => {
  const { t } = useTranslation();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  if (isConfirmed) {
    return (
      <div className="step-container confirmation">
        <div className="confirmation-icon">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>
        <h2 className="step-title success">Thank you for your purchase!</h2>
        <p className="confirmation-message">
          Your order has been placed successfully. You will receive your diamonds shortly!
        </p>

        <style jsx>{`
          .step-container.confirmation {
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            padding: 30px;
            border-radius: 12px;
            background-color: rgba(20, 20, 30, 0.8);
            border: 1px solid #32CD32;
            box-shadow: 0 0 20px rgba(50, 205, 50, 0.4);
            text-align: center;
          }

          .confirmation-icon {
            font-size: 4rem;
            color: #32CD32;
            margin-bottom: 20px;
            animation: pop 0.5s ease-out;
          }

          .step-title.success {
            color: #32CD32;
          }

          .confirmation-message {
            font-size: 1.1rem;
            margin-bottom: 20px;
            color: #ddd;
          }

          @keyframes pop {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="step-container summary-container">
      <h2 className="step-title">Order Summary</h2>
      
      <div className="summary-items">
        <div className="summary-item">
          <div className="summary-label">Player ID</div>
          <div className="summary-value player-id">{formData.playerId}</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-label">Diamond Quantity</div>
          <div className="summary-value highlight">{formData.quantity} Diamonds</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-label">Payment Method</div>
          <div className="summary-value">{t(paymentMethodTranslationKeys[formData.paymentMethod])}</div>
        </div>
      </div>
      
      <div className="buttons-container">
        <button className="btn step-button-secondary" onClick={prevStep}>
          Back
        </button>
        <button 
          className="btn btn-primary step-button"
          onClick={handleConfirm}
        >
          Confirm Purchase
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

        .summary-items {
          margin-bottom: 30px;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 1px solid rgba(138, 43, 226, 0.2);
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid rgba(138, 43, 226, 0.2);
        }
        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-label {
          font-weight: 500;
          color: #aaa;
          font-size: 0.95rem;
        }

        .summary-value {
          font-weight: 600;
          font-size: 1.05rem;
        }
        
        .summary-value.player-id {
          font-family: monospace;
        }

        .summary-value.highlight {
          color: var(--accent-color);
          text-shadow: 0 0 5px var(--accent-color);
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
      `}</style>
    </div>
  );
};

export default Summary; 