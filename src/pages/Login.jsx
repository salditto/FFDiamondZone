// pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";
import { useSnackbar } from "../context/SnackBarContext";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { showSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser({ email, password });
      showSnackbar("Sesión iniciada", "success");
      navigate("/");
    } catch (err) {
      showSnackbar("Credenciales inválidas", "error");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
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
            Ingresar
          </button>
        </form>
        <p className="switch-link">
          ¿No tenés cuenta? <a href="/register">Registrate</a>
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
