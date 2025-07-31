'use client'

import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function StripeCancel () {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/')
  }

  const handleTryAgain = () => {
    navigate('/')
  }

  return (
    <div className='cancel-container'>
      <div className='cancel-card'>
        <FontAwesomeIcon icon={faTimesCircle} className='cancel-icon' />
        <h2>Payment Cancelled</h2>
        <p>
          Your payment was cancelled. No charges have been made to your account.
        </p>

        <div className='cancel-info'>
          <h3>What happened?</h3>
          <ul>
            <li>❌ You cancelled the payment process</li>
            <li>💳 No money has been charged</li>
            <li>🔄 You can try again anytime</li>
            <li>❓ Contact support if you need help</li>
          </ul>
        </div>

        <div className='action-buttons'>
          <button onClick={handleTryAgain} className='try-again-button'>
            Try Again
          </button>
          <button onClick={handleGoBack} className='back-button'>
            <FontAwesomeIcon icon={faArrowLeft} />
            Go Back
          </button>
        </div>
      </div>

      <style jsx>{`
        .cancel-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          padding: 20px;
        }

        .cancel-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .cancel-icon {
          font-size: 4rem;
          color: #ff4757;
          margin-bottom: 20px;
        }

        h2 {
          color: #2c3e50;
          margin-bottom: 15px;
          font-size: 2rem;
        }

        p {
          color: #7f8c8d;
          margin-bottom: 30px;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .cancel-info {
          background: #fff5f5;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          text-align: left;
        }

        .cancel-info h3 {
          color: #2c3e50;
          margin-bottom: 15px;
          text-align: center;
        }

        .cancel-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .cancel-info li {
          padding: 8px 0;
          color: #e74c3c;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .try-again-button {
          background: linear-gradient(135deg, #2ed573, #17c0eb);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .try-again-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(46, 213, 115, 0.3);
        }

        .back-button {
          background: #6c757d;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
        }

        @media (max-width: 600px) {
          .cancel-card {
            padding: 30px 20px;
          }

          h2 {
            font-size: 1.5rem;
          }

          .cancel-icon {
            font-size: 3rem;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
