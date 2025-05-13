import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faUniversity, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'; // Use brand icon for Bitcoin

const paymentMethods = [
  { id: 'mercadopago', name: 'MercadoPago', icon: faCreditCard },
  { id: 'bank', name: 'Bank Transfer (ARS)', icon: faUniversity },
  { id: 'stripe', name: 'stripe', icon: faExchangeAlt },
  { id: 'crypto', name: 'Crypto (BTC, ETH)', icon: faBitcoin }
];

const Step3_Payment = ({ formData, setFormData, nextStep, prevStep }) => {
  const handlePaymentMethodChange = (methodId) => {
    setFormData({ ...formData, paymentMethod: methodId });
  };

  return (
    <div className="step-container step3-container">
      <h2 className="step-title">Select Payment Method</h2>
      
      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <div 
            key={method.id} 
            className={`payment-method ${formData.paymentMethod === method.id ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodChange(method.id)}
          >
            <div className="payment-icon">
               <FontAwesomeIcon icon={method.icon} />
            </div>
            <div className="payment-name">{method.name}</div>
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
          disabled={!formData.paymentMethod}
        >
          Review Order
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

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .payment-method {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 25px 15px;
          background-color: rgba(0, 0, 0, 0.2);
          border: 2px solid rgba(138, 43, 226, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 120px;
        }

        .payment-method:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 0 15px rgba(138, 43, 226, 0.5);
          border-color: rgba(138, 43, 226, 0.6);
        }

        .payment-method.selected {
          border-color: var(--accent-color);
          box-shadow: 0 0 15px rgba(138, 43, 226, 0.5);
          background-color: rgba(138, 43, 226, 0.15);
        }

        .payment-icon {
          font-size: 2.2rem;
          margin-bottom: 15px;
          color: var(--accent-color);
        }

        .payment-name {
          font-size: 1rem;
          text-align: center;
          font-weight: 500;
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

export default Step3_Payment; 