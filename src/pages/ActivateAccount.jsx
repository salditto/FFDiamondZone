import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { verifyEmailToken } from "../services/AuthService";

export const ActivateAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const token = searchParams.get("token");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        if (!token) throw new Error("Token inválido");
        await verifyEmailToken(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    activateAccount();
  }, [token]);

  const renderIcon = () => {
    if (status === "loading")
      return <FontAwesomeIcon icon={faSpinner} spin className="icon loading" />;
    if (status === "success")
      return <FontAwesomeIcon icon={faCircleCheck} className="icon success" />;
    if (status === "error")
      return <FontAwesomeIcon icon={faCircleXmark} className="icon error" />;
  };

  return (
    <div className="container">
      <div className="card">
        {renderIcon()}
        {status === "loading" && (
          <>
            <h1>Activando tu cuenta</h1>
            <p>Estamos verificando tu enlace. Un momento...</p>
          </>
        )}
        {status === "success" && (
          <>
            <h1>¡Cuenta activada!</h1>
            <p>Ya podés iniciar sesión y explorar FF Diamond Zone.</p>
            <button onClick={() => navigate("/")}>Volver al inicio</button>
          </>
        )}
        {status === "error" && (
          <>
            <h1>Enlace inválido</h1>
            <p>
              El token es inválido o ha expirado. Verificá el enlace del mail.
            </p>
            <button onClick={() => navigate("/")}>Volver al inicio</button>
          </>
        )}
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          padding: 2rem;
        }

        .card {
          border-radius: 24px;
          padding: 2.5rem 2rem;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 0.9rem;
          color: #ccc;
        }

        .icon {
          font-size: 2.8rem;
          margin-bottom: 1rem;
        }

        .loading {
          color: white;
        }

        button {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          margin-top: 1rem;
          border: none;
          padding: 0.6rem 3rem;
          border-radius: 12px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .success {
          color: #4ade80; /* verde suave */
        }

        .error {
          color: #ef4444; /* rojo suave */
        }
      `}</style>
    </div>
  );
};
