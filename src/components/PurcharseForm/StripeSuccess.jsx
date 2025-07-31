'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function StripeSuccess () {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const storedDetails = sessionStorage.getItem('stripe_package_details')

    if (!sessionId) {
      setError('No session ID found')
      setIsLoading(false)
      return
    }

    if (storedDetails) {
      try {
        const details = JSON.parse(storedDetails)
        setPaymentDetails(details)
      } catch (e) {
        console.error('Error parsing stored details:', e)
      }
    }

    // Clean up session storage
    sessionStorage.removeItem('stripe_session_id')
    sessionStorage.removeItem('stripe_payment_id')
    sessionStorage.removeItem('stripe_package_details')

    setIsLoading(false)
  }, [searchParams])

  const handleContinue = () => {
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className='success-container'>
        <div className='success-card'>
          <FontAwesomeIcon icon={faSpinner} className='loading-icon' spin />
          <h2>Processing your payment...</h2>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='success-container'>
        <div className='success-card error'>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleContinue} className='continue-button'>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='success-container'>
      <div className='success-card'>
        <FontAwesomeIcon icon={faCheckCircle} className='success-icon' />
        <h2>Payment Successful!</h2>
        <p>
          Thank you for your purchase. Your Free Fire diamonds will be delivered
          shortly.
        </p>

        {paymentDetails && (
          <div className='payment-details'>
            <h3>Order Details</h3>
            <div className='detail-row'>
              <span>Diamonds:</span>
              <span>{paymentDetails.diamonds}</span>
            </div>
            <div className='detail-row'>
              <span>Player ID:</span>
              <span>{paymentDetails.ffPlayerId}</span>
            </div>
            <div className='detail-row'>
              <span>Region:</span>
              <span>{paymentDetails.region.toUpperCase()}</span>
            </div>
            <div className='detail-row'>
              <span>Amount:</span>
              <span>${paymentDetails.amount} USD</span>
            </div>
          </div>
        )}

        <div className='next-steps'>
          <h3>What happens next?</h3>
          <ul>
            <li>✅ Your payment has been processed successfully</li>
            <li>
              🎮 Diamonds will be added to your Free Fire account within 5-10
              minutes
            </li>
            <li>📧 You'll receive a confirmation email shortly</li>
            <li>
              ❓ Contact support if you don't receive your diamonds within 30
              minutes
            </li>
          </ul>
        </div>

        <button onClick={handleContinue} className='continue-button'>
          Continue Shopping
        </button>
      </div>

      <style jsx>{`
        .success-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .success-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .success-card.error {
          border: 2px solid #ff4757;
        }

        .success-icon {
          font-size: 4rem;
          color: #2ed573;
          margin-bottom: 20px;
        }

        .loading-icon {
          font-size: 3rem;
          color: #667eea;
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

        .payment-details {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          text-align: left;
        }

        .payment-details h3 {
          color: #2c3e50;
          margin-bottom: 15px;
          text-align: center;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .detail-row:last-child {
          border-bottom: none;
          font-weight: bold;
        }

        .next-steps {
          background: #e8f5e8;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          text-align: left;
        }

        .next-steps h3 {
          color: #2c3e50;
          margin-bottom: 15px;
          text-align: center;
        }

        .next-steps ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .next-steps li {
          padding: 8px 0;
          color: #27ae60;
          font-weight: 500;
        }

        .continue-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .continue-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 600px) {
          .success-card {
            padding: 30px 20px;
          }

          h2 {
            font-size: 1.5rem;
          }

          .success-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  )
}
