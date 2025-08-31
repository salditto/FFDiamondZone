import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faGem,
  faShoppingCart,
  faMoneyBillTransfer,
  faCreditCard,
  faLandmark,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'
import { loadStripe } from '@stripe/stripe-js'
import DropPdf from '../payments/ConfirmationTransferBank'
import PaymentMercadoPago from '../payments/MercadoPagoConfirmation'
import { getPackageInfo } from '../services/BankTransfer.service'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
const paymentOptions = [
  { id: 'stripe', icon: faMoneyBillTransfer },
  { id: 'mercadopago', icon: faCreditCard },
  { id: 'bank_transfer_ars', icon: faLandmark },
  { id: 'crypto', icon: faBitcoin }
]

const ffRegions = [
  { code: 'ar', label: 'regions.ar' },
  { code: 'br', label: 'regions.br' },
  { code: 'us', label: 'regions.us' },
  { code: 'sg', label: 'regions.sg' },
  { code: 'in', label: 'regions.in' }
]

export default function PurchaseForm () {
  const { t } = useTranslation()
  const [userId, setUserId] = useState('')
  const [region, setRegion] = useState('ar')
  const [diamondOptions, setDiamondOptions] = useState([])
  const [playerId, setPlayerId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [playerIdError, setPlayerIdError] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [stripeError, setStripeError] = useState('')

  const [isPackagesLoading, setIsPackagesLoading] = useState(false)

  useEffect(() => {
    getUserId()
    fetchPackages()
  }, [])

  function getUserId () {
    const userId = sessionStorage.getItem('userId')
    setUserId(userId)
  }

  function validatePlayerId (id) {
    if (!id) return t('form.error_playerId_required')
    if (!/^\d+$/.test(id)) return t('form.error_playerId_numeric')
    if (id.length < 8 || id.length > 11) return t('form.error_playerId_length')
    return ''
  }

  function handlePlayerIdChange (e) {
    const v = e.target.value
    setPlayerId(v)
    setPlayerIdError(validatePlayerId(v))
  }

  function getSelectedPrice () {
    const opt = diamondOptions.find(o => o.id === quantity)
    return opt ? opt.price : '$0.00'
  }

  function getSelectedPriceInPesos () {
    const opt = diamondOptions.find(o => o.id === quantity)
    if (!opt || !opt.price) return '$0.00'
    const numericAmount = Number.parseFloat(opt.price.replace('$', '')) * 1120
    return '$' + Math.round(numericAmount).toString()
  }

  async function fetchPackages (method = paymentMethod) {
    setIsPackagesLoading(true)
    try {
      const data = await getPackageInfo()

      let filtered = []

      if (method === 'mercadopago') {
        filtered = data.filter(pkg => pkg.origin === 'MercadoPagoPackage')
      } else if (method === 'bank_transfer_ars') {
        filtered = data.filter(pkg => pkg.origin === 'TransferPackage')
      } else if (method === 'stripe') {
        // For Stripe, use TransferPackage since they have priceUSD values
        // This makes sense because Stripe processes international payments in USD
        filtered = data.filter(
          pkg => pkg.origin === 'TransferPackage' && pkg.priceUSD > 0
        )

        if (filtered.length === 0) {
          // Fallback: use all packages that have priceUSD
          filtered = data.filter(pkg => pkg.priceUSD && pkg.priceUSD > 0)
        }
      } else {
        // Default: show all packages
        filtered = data
      }

      const mapped = filtered.map(pkg => ({
        id: pkg.id.toString(),
        label: pkg.diamonds.toString(),
        // For Stripe, use USD price; for others use ARS converted to USD
        price:
          method === 'stripe' && pkg.priceUSD > 0
            ? `$${pkg.priceUSD.toFixed(2)}`
            : `$${(pkg.priceARS / 1120).toFixed(2)}`,
        bonus: 0,
        origin: pkg.origin,
        priceUSD: pkg.priceUSD, // Keep original USD price for Stripe
        priceARS: pkg.priceARS // Keep original ARS price
      }))

      setDiamondOptions(mapped)
      if (mapped.length > 0) {
        setQuantity(mapped[0].id)
      } else {
        setQuantity('')
      }
    } catch (e) {
      console.error('Error loading packages', e)
    } finally {
      setIsPackagesLoading(false)
    }
  }

  async function handleStripeCheckout () {
    const err = validatePlayerId(playerId)
    setPlayerIdError(err)
    if (err) return

    setIsLoading(true)
    setStripeError('')

    try {
      const token = sessionStorage.getItem('auth_token')

      // Check if user is authenticated
      if (!token) {
        setStripeError(
          t('form.please_login_first', 'Please log in first to make a payment')
        )
        return
      }

      // Find the selected package to get the correct price
      const selectedPackage = diamondOptions.find(opt => opt.id === quantity)

      const requestBody = {
        amount: selectedPackage.priceUSD, // Amount in dollars (backend will convert to cents)
        currency: 'USD',
        productName: `${selectedPackage.label} Free Fire Diamonds`,
        ffUser: playerId, // FF Player ID
        ffRegion: region, // FF Region
        packageId: Number.parseInt(quantity), // Package ID
        successUrl: `${window.location.origin}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/stripe-cancel`
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/StripePayments/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        }
      )

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Stripe API error:', errorData)

        // Handle 401 specifically
        if (response.status === 401) {
          setStripeError(
            t(
              'form.session_expired',
              'Your session has expired. Please log in again to continue.'
            )
          )
          // Trigger the session expired dialog
          window.dispatchEvent(new Event('forceLogout'))
          return
        }

        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }

      const responseData = await response.json()
      // Get the session ID and redirect to Stripe
      const { sessionId, paymentId } = responseData

      if (!sessionId) {
        throw new Error('No session ID received from server')
      }

      // Store session info for later verification
      sessionStorage.setItem('stripe_session_id', sessionId)
      sessionStorage.setItem('stripe_payment_id', paymentId)
      sessionStorage.setItem(
        'stripe_package_details',
        JSON.stringify({
          packageId: quantity,
          ffPlayerId: playerId,
          region: region,
          userId: userId,
          amount: selectedPackage.priceUSD.toString(),
          diamonds: selectedPackage.label,
          packageOrigin: selectedPackage.origin
        })
      )

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Stripe checkout error:', error)

      // Handle specific authentication error
      if (error.message === 'AUTHENTICATION_REQUIRED') {
        setStripeError(
          t(
            'form.session_expired',
            'Your session has expired. Please log in again to continue.'
          )
        )
        window.dispatchEvent(new Event('forceLogout'))
        return
      }

      // Handle other errors
      if (
        error.message.includes('Network') ||
        error.message.includes('fetch')
      ) {
        setStripeError(
          t(
            'form.network_error',
            'Network error. Please check your connection and try again.'
          )
        )
      } else {
        setStripeError(
          error.message ||
            t(
              'form.error_creating_session',
              'Error creating payment session. Please try again.'
            )
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Check if player ID step is complete
  const isPlayerIdValid = playerId && !playerIdError

  return (
    <form className='purchase-form' onSubmit={e => e.preventDefault()}>
      {/* Step 1 - Player ID */}
      <div className='form-step'>
        <div className='step-header'>
          <span className='step-number'>1</span>
          <h3 className='step-title'>{t('form.step1_title')}</h3>
        </div>
        <div className='form-group'>
          <div className='input-with-icon player-id-input-wrapper'>
            <FontAwesomeIcon icon={faUser} className='input-icon' />
            <input
              type='text'
              value={playerId}
              onChange={handlePlayerIdChange}
              placeholder={t('form.playerId_placeholder')}
              className={playerIdError ? 'input-error' : ''}
              maxLength={11}
              disabled={isSuccess}
            />
          </div>
          {playerIdError && !isSuccess && (
            <p className='error-message'>{playerIdError}</p>
          )}
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className='region-select'
            disabled={isSuccess}
          >
            {ffRegions.map(r => (
              <option key={r.code} value={r.code}>
                {t(`purchase.regions.${r.code}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 2 - Payment Method Selection */}
      <div className='form-step'>
        <div className='step-header'>
          <span className='step-number'>2</span>
          <h3 className='step-title'>{t('form.step3_title')}</h3>
        </div>
        <div className='form-group payment-options'>
          {paymentOptions.map(opt => {
            const isDisabled =
              opt.id === 'crypto' || // Keep crypto disabled
              isSuccess ||
              !isPlayerIdValid // Only disable if player ID is not valid

            return (
              <button
                key={opt.id}
                type='button'
                className={`payment-button ${
                  paymentMethod === opt.id ? 'selected' : ''
                }`}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) {
                    setPaymentMethod(opt.id)
                    fetchPackages(opt.id)
                    setQuantity('') // Reset quantity when changing payment method
                    setStripeError('') // Clear any previous Stripe errors
                  }
                }}
              >
                <FontAwesomeIcon icon={opt.icon} className='button-icon' />
                <span>{t(`form.payment.${opt.id}`)}</span>
              </button>
            )
          })}
        </div>

        {!isPlayerIdValid && (
          <p className='error-message'>
            {playerIdError || t('form.error_playerId_required')}
          </p>
        )}
      </div>

      {/* Step 3 - Package Selection */}
      <div className='form-step'>
        <div className='step-header'>
          <span className='step-number'>3</span>
          <h3 className='step-title'>{t('form.step2_title')}</h3>
        </div>

        <div className='form-group quantity-options'>
          {isPackagesLoading ? (
            <div className='loading-spinner'></div>
          ) : diamondOptions.length === 0 ? (
            <div className='no-packages-message'>
              <p>
                No packages available for{' '}
                {paymentMethod || 'this payment method'}.
              </p>
              <p>Please try a different payment method or contact support.</p>
            </div>
          ) : (
            diamondOptions.map(opt => (
              <button
                key={opt.id}
                type='button'
                className={`quantity-button ${
                  quantity === opt.id ? 'selected' : ''
                } ${opt.outOfStock ? 'out-of-stock' : ''}`}
                disabled={
                  isSuccess ||
                  opt.outOfStock ||
                  !isPlayerIdValid ||
                  !paymentMethod
                }
                onClick={() => setQuantity(opt.id)}
              >
                <div className='button-main-content'>
                  <FontAwesomeIcon icon={faGem} className='button-icon' />
                  <span>{t('form.diamonds_label', { label: opt.label })}</span>
                </div>
                {!opt.outOfStock && (
                  <>
                    {opt.bonus > 0 && (
                      <span className='bonus-text'>
                        {t('form.bonus_text', { bonus: opt.bonus })}
                      </span>
                    )}
                    <span className='price'>{opt.price}</span>
                    {paymentMethod === 'stripe' && (
                      <span className='currency-note'>USD</span>
                    )}
                  </>
                )}
                {opt.outOfStock && (
                  <span className='out-of-stock-text'>
                    {t('purchase.out_of_stock')}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {!isPlayerIdValid && (
          <p className='error-message'>
            {playerIdError || t('form.error_playerId_required')}
          </p>
        )}
        {!paymentMethod && isPlayerIdValid && (
          <p className='error-message'>{t('purchase.select_payment_first')}</p>
        )}
      </div>

      {/* Stripe Payment Button */}
      {paymentMethod === 'stripe' && (
        <div className='form-step'>
          <div className='step-header'>
            <span className='step-number'>4</span>
            <h3 className='step-title'>Complete Payment</h3>
          </div>

          {stripeError && (
            <div className='error-message stripe-error'>
              <strong>Payment Error:</strong> {stripeError}
            </div>
          )}

          <button
            type='button'
            className='purchase-button stripe-button'
            disabled={!isPlayerIdValid || !quantity || isLoading}
            onClick={handleStripeCheckout}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            {isLoading
              ? t('purchase.loading')
              : `Pay ${getSelectedPrice()} USD with Stripe`}
          </button>

          <div className='stripe-info'>
            <p>✅ Secure payment powered by Stripe</p>
            <p>💳 Accepts all major credit cards</p>
            <p>🔒 Your payment information is encrypted and secure</p>
            <p>🌍 International payments in USD</p>
            <p>🚀 Redirects to Stripe's secure checkout page</p>
          </div>
        </div>
      )}

      {/* MercadoPago Payment */}
      {paymentMethod === 'mercadopago' && (
        <PaymentMercadoPago
          playerId={userId}
          quantity={quantity}
          isLoading={isLoading}
          diamondOptions={diamondOptions}
          playerIdError={playerIdError}
          ffUser={playerId}
          ffRegion={region}
          packageId={quantity}
        />
      )}

      {/* Bank Transfer Payment */}
      {paymentMethod === 'bank_transfer_ars' && (
        <>
          <div className='form-step'>
            <div className='step-header'>
              <span className='step-number'>4</span>
              <h3 className='step-title'>
                {t('purchase.transfer_data.title')}
              </h3>
            </div>
            <div className='form-group'>
              <p>
                <strong>{t('purchase.transfer_data.amount')}</strong>{' '}
                {getSelectedPriceInPesos()}
              </p>
              <p>
                <strong>{t('purchase.transfer_data.alias')}</strong>{' '}
                <span className='alias-copy'>ffdiamondzone</span>
              </p>
              <p>
                <strong>{t('purchase.transfer_data.cbu')}</strong>{' '}
                <span className='alias-copy'>0000003100055519928336</span>
              </p>
              <p>
                <em>{t('purchase.transfer_data.reminder')}</em>
              </p>
            </div>
          </div>

          <div className='form-step'>
            <div className='step-header'>
              <span className='step-number'>5</span>
              <h3 className='step-title'>{t('upload.title')}</h3>
            </div>
            <DropPdf
              userId={userId}
              FFUser={playerId}
              FFRegion={region}
              packageId={quantity}
              playerIdError={playerIdError}
            />
          </div>
        </>
      )}

      {/* Success Message */}
      {isSuccess ? (
        <div className='success-message'>
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>{t('form.success_message')}</span>
        </div>
      ) : null}

      <style jsx>{`
        .purchase-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 30px;
          background-color: transparent;
          border: none;
          box-shadow: none;
          box-sizing: border-box;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          margin: 20px auto;
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top: 4px solid var(--accent-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .no-packages-message {
          text-align: center;
          padding: 40px 20px;
          background-color: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          color: var(--text-color);
        }

        .no-packages-message p {
          margin: 10px 0;
          font-size: var(--font-size-md);
        }

        .no-packages-message p:first-child {
          font-weight: var(--font-weight-semibold);
          color: #ffc107;
        }

        .form-step {
          padding: 30px;
          border: 1px solid var(--border-color-accent);
          border-radius: 10px;
          background-color: var(--bg-color-medium);
          margin-bottom: 25px;
          backdrop-filter: blur(5px);
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color-accent);
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          background-color: var(--accent-color);
          color: white;
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-md);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .step-title {
          font-size: var(--font-size-xl);
          color: var(--text-color);
          font-weight: var(--font-weight-semibold);
          margin: 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: stretch;
        }

        label {
          font-weight: var(--font-weight-semibold);
          color: var(--text-color);
          display: flex;
          align-items: center;
        }

        input[type='text'] {
          padding: 14px 15px 14px 45px;
          border-radius: 8px;
          border: 1px solid var(--border-color-light);
          background-color: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: var(--font-size-md);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          width: 100%;
          box-sizing: border-box;
        }

        input[type='text']:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.3);
        }

        input.input-error {
          border-color: var(--error-color);
          box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.3);
        }

        .error-message {
          color: var(--error-color);
          font-size: var(--font-size-xs);
          margin-top: 5px;
        }

        .stripe-error {
          background-color: rgba(255, 77, 77, 0.1);
          border: 1px solid rgba(255, 77, 77, 0.3);
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .quantity-options,
        .payment-options {
          display: grid;
          gap: 18px;
        }

        .quantity-options {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }

        .payment-options {
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }

        .quantity-button,
        .payment-button {
          padding: 15px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          text-align: center;
          position: relative;
          border-radius: 8px;
          border: 1px solid var(--border-color-light);
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--subtext-color);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
        }

        .button-main-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 2px;
        }

        .quantity-button .button-icon {
          font-size: var(--font-size-md);
          width: auto;
          margin-right: 0;
        }

        .quantity-button .button-label {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--text-color);
        }

        .bonus-text {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
          color: #ffd700;
          background-color: rgba(255, 215, 0, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 4px;
        }

        .quantity-button .price {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-bold);
          color: var(--subtext-color);
          margin-top: 0;
        }

        .currency-note {
          font-size: var(--font-size-xs);
          color: #4f46e5;
          font-weight: var(--font-weight-semibold);
          background-color: rgba(79, 70, 229, 0.1);
          padding: 2px 6px;
          border-radius: 3px;
          margin-top: 2px;
        }

        .quantity-button:hover {
          background-color: rgba(138, 43, 226, 0.15);
          border-color: rgba(138, 43, 226, 0.6);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(138, 43, 226, 0.2);
        }

        .quantity-button.selected {
          background: linear-gradient(
            135deg,
            var(--accent-color),
            var(--accent-color-2)
          );
          border-color: var(--accent-color-2);
          color: #fff;
          box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
          transform: scale(1.03);
        }

        .quantity-button.selected .button-label {
          color: #fff;
          font-weight: var(--font-weight-bold);
        }

        .quantity-button.selected .price {
          color: #fff;
        }

        .quantity-button.selected .bonus-text {
          color: #1a1a1a;
          background-color: #ffd700;
        }

        .quantity-button.selected .currency-note {
          color: #1a1a1a;
          background-color: rgba(255, 255, 255, 0.9);
        }

        .input-with-icon {
          position: relative;
        }

        .full-width-input-container {
          width: 100%;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          font-size: var(--font-size-md);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .purchase-button {
          padding: 18px 35px;
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          margin-top: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: linear-gradient(
            135deg,
            var(--accent-color),
            var(--accent-color-2)
          );
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3);
        }

        .purchase-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(138, 43, 226, 0.4);
        }

        .purchase-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #555;
          border-color: #555;
          transform: none;
          box-shadow: none;
        }

        .stripe-button {
          background: linear-gradient(135deg, #635bff, #4f46e5);
          box-shadow: 0 4px 15px rgba(99, 91, 255, 0.3);
        }

        .stripe-button:hover {
          box-shadow: 0 6px 20px rgba(99, 91, 255, 0.4);
        }

        .stripe-info {
          margin-top: 15px;
          padding: 15px;
          background-color: rgba(99, 91, 255, 0.1);
          border: 1px solid rgba(99, 91, 255, 0.3);
          border-radius: 8px;
          font-size: var(--font-size-sm);
          color: var(--text-color);
        }

        .stripe-info p {
          margin: 5px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 600px) {
          .form-step {
            padding: 20px;
          }
          .quantity-options,
          .payment-options {
            grid-template-columns: 1fr;
          }
        }

        .payment-button .button-icon {
          font-size: var(--font-size-lg);
          margin-bottom: 5px;
        }

        .payment-button span {
          font-size: var(--font-size-md);
        }

        .payment-button:hover {
          background-color: rgba(138, 43, 226, 0.1);
          border-color: rgba(138, 43, 226, 0.5);
          transform: translateY(-2px);
        }

        .payment-button.selected {
          background-color: var(--accent-color);
          border-color: var(--accent-color);
          color: #fff;
          font-weight: var(--font-weight-semibold);
          box-shadow: 0 0 10px rgba(138, 43, 226, 0.4);
        }

        .payment-button.selected .button-icon {
          color: #fff;
        }

        .quantity-button:disabled,
        .payment-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: rgba(255, 255, 255, 0.03);
          border-color: var(--border-color-light);
          box-shadow: none;
          transform: none;
        }

        .quantity-button:disabled:hover,
        .payment-button:disabled:hover {
          background-color: rgba(255, 255, 255, 0.03);
          border-color: var(--border-color-light);
          transform: none;
          box-shadow: none;
        }

        input[type='text']:disabled {
          background-color: rgba(255, 255, 255, 0.05);
          opacity: 0.6;
          cursor: not-allowed;
          border-color: var(--border-color-light);
        }

        .success-message {
          margin-top: 20px;
          padding: 15px 20px;
          background-color: rgba(46, 204, 113, 0.15);
          border: 1px solid rgba(46, 204, 113, 0.5);
          color: var(--success-color);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-md);
          text-align: center;
        }

        .success-message svg {
          font-size: var(--font-size-lg);
        }

        .success-message span {
          margin-left: 10px;
          font-size: var(--font-size-md);
        }

        .player-id-input-wrapper {
          flex-grow: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .player-id-input-wrapper input {
          width: 100%;
        }

        .region-select {
          padding: 12px 15px;
          border: 1px solid var(--border-color-light);
          background-color: rgba(0, 0, 0, 0.2);
          color: var(--text-color);
          border-radius: 6px;
          font-size: var(--font-size-md);
          font-family: var(--font-base);
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          min-width: 150px;
          height: 48.8px;
          flex-shrink: 0;
        }

        .region-select:focus,
        input[type='text']:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.3);
        }

        .region-select:disabled,
        input[type='text']:disabled {
          background-color: rgba(50, 50, 50, 0.3);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .region-select option {
          background-color: var(--bg-color-dark);
          color: var(--text-color);
        }

        .quantity-button.out-of-stock {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: rgba(255, 255, 255, 0.03);
          border-color: var(--border-color-light);
        }
        .quantity-button.out-of-stock:hover {
          background-color: rgba(255, 255, 255, 0.03);
          border-color: var(--border-color-light);
          transform: none;
          box-shadow: none;
        }
        .out-of-stock-text {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          color: var(--error-color);
          margin-top: 4px;
        }
      `}</style>
    </form>
  )
}
