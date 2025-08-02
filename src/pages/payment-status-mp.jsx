import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getStatusPaymentMp } from '../services/MercadoPago.service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSpinner,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'

export default function PaymentStatusMp () {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const paymentId = location.state?.paymentId

  // ✅ Add polling to continuously check status
  useEffect(() => {
    let intervalId

    const checkStatus = async () => {
      if (!paymentId) {
        setStatus('ERROR')
        setLoading(false)
        return
      }

      try {
        const data = await getStatusPaymentMp(paymentId)

        const mappedStatus = mapMercadoPagoStatus(data.status)
        setStatus(mappedStatus)

        if (mappedStatus === 'SUCCESS' || mappedStatus === 'ERROR') {
          setPolling(false)
          setLoading(false)
        } else {
          setPolling(true)
          setLoading(false)
        }
      } catch (err) {
        console.error('Error checking payment status:', err)
        setStatus('ERROR')
        setPolling(false)
        setLoading(false)
      }
    }

    checkStatus()

    if (polling) {
      intervalId = setInterval(checkStatus, 5000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [paymentId, polling])

  // ✅ Map MercadoPago statuses to your app's statuses
  const mapMercadoPagoStatus = mpStatus => {
    switch (mpStatus?.toLowerCase()) {
      case 'approved':
      case 'succeeded':
      case 'success':
        return 'SUCCESS'
      case 'pending':
      case 'in_process':
      case 'init':
        return 'PENDING'
      case 'rejected':
      case 'cancelled':
      case 'failed':
        return 'ERROR'
      default:
        return 'PENDING' // Default to pending for unknown statuses
    }
  }

  const renderStatusMessage = () => {
    if (loading) {
      return (
        <div className='status-message pending'>
          <FontAwesomeIcon icon={faSpinner} spin />
          <span>Verificando estado del pago...</span>
        </div>
      )
    }

    switch (status) {
      case 'SUCCESS':
        return (
          <div className='status-message success'>
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>
              ¡Pago confirmado! Tus diamantes serán agregados en 5-10 minutos.
            </span>
            <button className='home-button' onClick={() => navigate('/')}>
              Volver al inicio
            </button>
          </div>
        )
      case 'PENDING':
        return (
          <div className='status-message pending'>
            <FontAwesomeIcon icon={faSpinner} spin />
            <span>Pago pendiente. Verificando cada 5 segundos...</span>
            <p className='status-note'>
              No cierres esta página. Te notificaremos cuando se confirme.
            </p>
          </div>
        )
      case 'ERROR':
      default:
        return (
          <div className='status-message error'>
            <FontAwesomeIcon icon={faTimesCircle} />
            <span>
              Error al procesar el pago. Contacta soporte si ya pagaste.
            </span>
            <button className='home-button' onClick={() => navigate('/')}>
              Volver al inicio
            </button>
          </div>
        )
    }
  }

  return (
    <div className='status-wrapper'>
      <div className='status-box'>
        <h2 className='status-title'>Estado del pago</h2>
        {renderStatusMessage()}
      </div>
      <style jsx>{`
        .status-wrapper {
          background-color: #0e0b1f;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 1rem;
        }

        .status-box {
          background: #1c1534;
          border: 2px solid #9b4dff;
          padding: 2.5rem;
          border-radius: 0.75rem;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 0 20px #9b4dff88;
          text-align: center;
        }

        .status-title {
          margin-bottom: 1.25rem;
          font-size: 1.5rem;
          color: #d4bfff;
        }

        .status-message {
          font-size: 1.1rem;
          padding: 1rem;
          border-radius: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 120px;
        }

        .status-message.success {
          background-color: #28a74522;
          border: 1px solid #28a745;
          color: #28a745;
        }

        .status-message.pending {
          background-color: #ffc10722;
          border: 1px solid #ffc107;
          color: #ffc107;
        }

        .status-message.error {
          background-color: #dc354522;
          border: 1px solid #dc3545;
          color: #dc3545;
        }

        .status-note {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 10px;
        }

        .home-button {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: #9b4dff;
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .home-button:hover {
          background-color: #b86bff;
        }
      `}</style>
    </div>
  )
}
