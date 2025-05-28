// pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Completá todos los campos");
      return;
    }

    try {
      const result = await registerUser({ email, password });
      alert("Cuenta creada. Chequea tu mail para activar tu cuenta.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error al registrar usuario");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Crear cuenta</h2>
        <form onSubmit={handleRegister}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="auth-button" type="submit">
            Registrarse
          </button>
        </form>
        <p className="switch-link">
          ¿Ya tenés cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </div>
      <style jsx>{`
        .auth-wrapper {
          background-color: #0e0b1f;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 1rem;
        }

        .auth-box {
          background: #1c1534;
          border: 2px solid #9b4dff;
          padding: 2.5rem;
          border-radius: 0.75rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 0 20px #9b4dff88;
        }

        .auth-title {
          text-align: center;
          margin-bottom: 1.25rem;
          font-size: 1.5rem;
          color: #d4bfff;
        }

        .auth-input {
          width: 100%;
          padding: 0.75rem;
          margin: 0.625rem 0 1.25rem 0;
          background: #2b2145;
          border: 1px solid #9b4dff;
          border-radius: 0.5rem;
          color: #fff;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .auth-input:focus {
          outline: none;
          border-color: #c77dff;
        }

        .auth-button {
          width: 100%;
          padding: 0.75rem;
          background: #9b4dff;
          border: none;
          border-radius: 0.5rem;
          color: #fff;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .auth-button:hover {
          background: #b86bff;
        }

        .switch-link {
          text-align: center;
          margin-top: 0.75rem;
        }

        .switch-link a {
          color: #9b4dff;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .switch-link a:hover {
          color: #d1a8ff;
        }
      `}</style>
    </div>
  );
}
