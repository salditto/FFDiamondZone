import React from "react";
import { useTranslation } from "react-i18next";

export default function SessionExpiredDialog({ open, onClose, onLogin }) {
  const { t } = useTranslation();
  
  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>{t("session.expired_title")}</h3>
        <p>{t("session.expired_message")}</p>
        <div className="dialog-buttons">
          <button className="neon-btn" onClick={onLogin}>
            {t("session.login_button")}
          </button>
          <button className="neon-btn outline" onClick={onClose}>
            {t("session.close_button")}
          </button>
        </div>
      </div>

      <style jsx>{`
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .dialog-box {
          background: linear-gradient(
            145deg,
            rgba(20, 20, 30, 0.95),
            rgba(10, 10, 20, 0.95)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 35px 30px;
          max-width: 420px;
          width: 100%;
          color: #fff;
          text-align: center;
          box-shadow: 0 0 25px rgba(138, 43, 226, 0.35);
          animation: fadeIn 0.3s ease-out;
        }

        .dialog-box h3 {
          font-size: 1.8rem;
          margin-bottom: 12px;
          color: #f0f0f0;
        }

        .dialog-box p {
          color: #bbb;
          font-size: 1rem;
        }

        .dialog-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 25px;
        }

        .neon-btn {
          padding: 10px 22px;
          border: none;
          border-radius: 8px;
          background: #8a2be2;
          color: white;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(138, 43, 226, 0.6);
          transition: all 0.2s ease;
        }

        .neon-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(138, 43, 226, 0.8);
        }

        .neon-btn.outline {
          background: transparent;
          border: 1px solid #8a2be2;
          color: #8a2be2;
          box-shadow: none;
        }

        .neon-btn.outline:hover {
          background: rgba(138, 43, 226, 0.1);
          box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
