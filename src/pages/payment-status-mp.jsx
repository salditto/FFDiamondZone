import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStatusPaymentMp } from "../services/MercadoPago.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function PaymentStatusMp() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const paymentId = location.state?.paymentId;

  useEffect(() => {
    const checkStatus = async () => {
      if (!paymentId) {
        setStatus("ERROR");
        setLoading(false);
        return;
      }
      try {
        const data = await getStatusPaymentMp(paymentId);
        setStatus(data.status); // 'OKEY', 'PENDING', 'ERROR'
      } catch (err) {
        console.error(err);
        setStatus("ERROR");
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [paymentId]);

  const renderStatusMessage = () => {
    if (loading) {
      return (
        <p className="status-message pending">
          <FontAwesomeIcon icon={faSpinner} spin /> Cargando estado de pago...
        </p>
      );
    }

    switch (status) {
      case "Succeeded":
        return (
          <>
            <p className="status-message success">
              Pago confirmado. ¡Gracias por tu compra!
            </p>
            <button className="home-button" onClick={() => navigate("/")}>
              Volver al inicio
            </button>
          </>
        );
      case "init":
        return (
          <p className="status-message pending">
            <FontAwesomeIcon icon={faSpinner} spin /> Pago pendiente. Te
            notificaremos cuando se confirme.
          </p>
        );
      case "ERROR":
      default:
        return (
          <>
            <p className="status-message error">
              Hubo un error al procesar el pago. Intentá nuevamente.
            </p>
            <button className="home-button" onClick={() => navigate("/")}>
              Volver al inicio
            </button>
          </>
        );
    }
  };

  return (
    <div className="status-wrapper">
      <div className="status-box">
        <h2 className="status-title">Estado del pago</h2>
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
          max-width: 400px;
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
          align-items: center;
          justify-content: center;
          gap: 10px;
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
  );
}
