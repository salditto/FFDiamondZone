'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faArrowLeft,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: 'transparent',
      '::placeholder': {
        color: '#aab7c4'
      },
      iconColor: '#ffffff'
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: false
}

function CheckoutForm ({ clientSecret, packageDetails }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    const { error: confirmError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `Free Fire Player ${packageDetails.ffPlayerId}`
          }
        }
      })

    if (confirmError) {
      setError(confirmError.message)
      setIsLoading(false)
    } else {
      setSucceeded(true)
      setIsLoading(false)

      // Redirect to success page after a short delay
      setTimeout(() => {
        navigate(
          `/stripe-success?payment_intent=${paymentIntent.id}&package_id=${packageDetails.packageId}&player_id=${packageDetails.ffPlayerId}&diamonds=${packageDetails.diamonds}&region=${packageDetails.region}`
        )
      }, 2000)
    }
  }

  if (succeeded) {
    return (
      <div className='payment-success'>
        <FontAwesomeIcon icon={faCheckCircle} className='success-icon' />
        <h2>Payment Successful!</h2>
        <p>Your payment has been processed successfully.</p>
        <p>Redirecting to confirmation page...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='payment-form'>
      <div className='payment-details'>
        <h3>
          <FontAwesomeIcon icon={faCreditCard} />
          Payment Details
        </h3>
        <div className='package-info'>
          <div className='info-row'>
            <span className='label'>Package:</span>
            <span className='value'>{packageDetails.diamonds} Diamonds</span>
          </div>
          <div className='info-row'>
            <span className='label'>Free Fire Player ID:</span>
            <span className='value'>{packageDetails.ffPlayerId}</span>
          </div>
          <div className='info-row'>
            <span className='label'>Region:</span>
            <span className='value'>
              {packageDetails.region?.toUpperCase()}
            </span>
          </div>
          <div className='info-row total'>
            <span className='label'>Total Amount:</span>
            <span className='value'>${packageDetails.amount} USD</span>
          </div>
        </div>
      </div>

      <div className='card-element-container'>
        <label htmlFor='card-element'>Credit or Debit Card</label>
        <CardElement id='card-element' options={cardElementOptions} />
      </div>

      {error && (
        <div className='error-message'>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
        </div>
      )}

      <button
        type='submit'
        disabled={!stripe || isLoading}
        className='pay-button'
      >
        {isLoading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin />
            Processing Payment...
          </>
        ) : (
          `Pay $${packageDetails.amount} USD`
        )}
      </button>

      <div className='security-info'>
        <p>🔒 Your payment information is encrypted and secure</p>
        <p>💳 Powered by Stripe - trusted by millions worldwide</p>
        <p>
          🎮 Diamonds will be delivered to Free Fire Player ID:{' '}
          {packageDetails.ffPlayerId}
        </p>
      </div>

      <style jsx>{`
        .payment-form {
          max-width: 500px;
          margin: 0 auto;
          padding: 30px;
          background-color: var(--bg-color-medium);
          border-radius: 12px;
          border: 1px solid var(--border-color-accent);
        }

        .payment-details {
          margin-bottom: 30px;
          padding: 20px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid var(--border-color-light);
        }

        .payment-details h3 {
          color: var(--text-color);
          margin-bottom: 15px;
          font-size: var(--font-size-lg);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .package-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row.total {
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-lg);
          border-top: 2px solid var(--accent-color);
          padding-top: 12px;
          margin-top: 8px;
        }

        .label {
          color: var(--subtext-color);
          font-size: var(--font-size-sm);
        }

        .value {
          color: var(--text-color);
          font-weight: var(--font-weight-semibold);
        }

        .info-row.total .label,
        .info-row.total .value {
          color: var(--text-color);
        }

        .card-element-container {
          margin-bottom: 20px;
        }

        .card-element-container label {
          display: block;
          margin-bottom: 10px;
          color: var(--text-color);
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-md);
        }

        .card-element-container :global(.StripeElement) {
          padding: 15px;
          border: 1px solid var(--border-color-light);
          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.05);
          transition: border-color 0.3s ease;
        }

        .card-element-container :global(.StripeElement:focus) {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.3);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          background-color: rgba(255, 77, 77, 0.1);
          border: 1px solid rgba(255, 77, 77, 0.3);
          border-radius: 8px;
          color: var(--error-color);
          margin-bottom: 20px;
          font-size: var(--font-size-sm);
        }

        .pay-button {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #635bff, #4f46e5);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .pay-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 91, 255, 0.4);
        }

        .pay-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .security-info {
          text-align: center;
          font-size: var(--font-size-sm);
          color: var(--subtext-color);
        }

        .security-info p {
          margin: 8px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .payment-success {
          text-align: center;
          padding: 40px;
          background-color: var(--bg-color-medium);
          border-radius: 12px;
          border: 1px solid var(--border-color-accent);
          max-width: 500px;
          margin: 0 auto;
        }

        .success-icon {
          font-size: 4rem;
          color: var(--success-color);
          margin-bottom: 20px;
        }

        .payment-success h2 {
          color: var(--text-color);
          margin-bottom: 15px;
          font-size: var(--font-size-xl);
        }

        .payment-success p {
          color: var(--subtext-color);
          margin: 10px 0;
          font-size: var(--font-size-md);
        }
      `}</style>
    </form>
  )
}

export default function StripePayment () {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const clientSecret = searchParams.get('client_secret')
  const packageId = searchParams.get('package_id')
  const ffPlayerId = searchParams.get('player_id') // This is the FF Player ID
  const region = searchParams.get('region')
  const userId = searchParams.get('user_id') // This is the logged-in user ID
  const amount = searchParams.get('amount')
  const diamonds = searchParams.get('diamonds')
  const packageOrigin = searchParams.get('package_origin')

  const packageDetails = {
    packageId,
    ffPlayerId, // Free Fire Player ID
    region,
    userId, // Logged-in user ID
    amount,
    diamonds,
    packageOrigin
  }

  if (!clientSecret) {
    return (
      <div className='stripe-payment-page'>
        <div className='container'>
          <div className='error-container'>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className='error-icon'
            />
            <h2>Payment Error</h2>
            <p>Invalid payment session. Please try again.</p>
            <button onClick={() => navigate('/')} className='back-button'>
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='stripe-payment-page'>
      <div className='container'>
        <div className='header'>
          <button onClick={() => navigate('/')} className='back-button'>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <h1>Complete Your Payment</h1>
          <p>Secure payment powered by Stripe</p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            packageDetails={packageDetails}
          />
        </Elements>
      </div>

      <style jsx>{`
        .stripe-payment-page {
          min-height: 100vh;
          background: var(--bg-color-dark);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container {
          width: 100%;
          max-width: 600px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header h1 {
          color: var(--text-color);
          font-size: var(--font-size-xxl);
          margin-bottom: 10px;
        }

        .header p {
          color: var(--subtext-color);
          font-size: var(--font-size-md);
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background-color: transparent;
          color: var(--subtext-color);
          border: 1px solid var(--border-color-light);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: var(--font-size-sm);
          margin-bottom: 20px;
        }

        .back-button:hover {
          background-color: rgba(255, 255, 255, 0.05);
          border-color: var(--accent-color);
          color: var(--text-color);
        }

        .error-container {
          text-align: center;
          padding: 40px;
          background-color: var(--bg-color-medium);
          border-radius: 12px;
          border: 1px solid var(--border-color-accent);
          max-width: 500px;
          margin: 0 auto;
        }

        .error-icon {
          font-size: 4rem;
          color: var(--error-color);
          margin-bottom: 20px;
        }

        .error-container h2 {
          color: var(--text-color);
          margin-bottom: 15px;
          font-size: var(--font-size-xl);
        }

        .error-container p {
          color: var(--subtext-color);
          margin-bottom: 30px;
          font-size: var(--font-size-md);
        }
      `}</style>
    </div>
  )
}
