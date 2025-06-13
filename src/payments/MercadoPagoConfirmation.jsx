import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { postMpBuy } from "../services/MercadoPago.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PaymentMercadoPago({
  playerId,
  quantity,
  isLoading: externalLoading,
  diamondOptions,
  playerIdError,
  ffUser,
  ffRegion,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const isLoggedIn = !!sessionStorage.getItem("auth_token");

  const getSelectedPriceForMp = () => {
    const opt = diamondOptions.find((o) => o.id === quantity);
    if (!opt || !opt.price) return "$0.00";
    const numericAmount = parseFloat(opt.price.replace("$", "")) * 1120;
    return "$" + Math.round(numericAmount).toString();
  };

  const handleBuyMp = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const opt = diamondOptions.find((o) => o.id === quantity);
      const numericAmount = parseFloat(opt.price.replace("$", "")) * 1120;
      const result = await postMpBuy({
        amount: numericAmount,
        userId: userId,
        ffUser: ffUser,
        ffRegion: ffRegion,
      });
      if (result.initPoint) {
        navigate("/payment-status-mp", {
          state: { paymentId: result.paymentId },
        });
        window.open(result.initPoint, "_blank");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form-step">
        <div className="step-header">
          <span className="step-number">4</span>
          <h3 className="step-title">{t("form.step4_title")}</h3>
        </div>
        <button
          type="button"
          className="payment-button"
          style={{ width: "100%" }}
          disabled={
            !userId ||
            loading ||
            externalLoading ||
            playerIdError ||
            !isLoggedIn
          }
          onClick={handleBuyMp}
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Cargando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faShoppingCart} />{" "}
              {t("form.submit_button", { price: getSelectedPriceForMp() })}
            </>
          )}
        </button>

        {!isLoggedIn && (
          <p
            style={{
              color: "#ff4d4d",
              fontWeight: "bold",
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            Necesitás estar logueado para comprar diamantes
          </p>
        )}
      </div>  
      <style jsx>{`
        .payment-button {
          padding: 15px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          gap: 5px;
          text-align: center;
          border-radius: 8px;
          border: 1px solid var(--border-color-light);
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--subtext-color);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
        }
        .purchase-button {
          padding: 15px 30px;
          font-size: var(--font-size-lg);
          margin-top: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .purchase-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #555;
          border-color: #555;
        }
        .button-center {
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }
      `}</style>
    </div>
  );
}
