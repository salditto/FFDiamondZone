import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGem,
  faShoppingCart,
  faMoneyBillTransfer, // Para stripe (alternativa)
  faCreditCard, // Para MercadoPago (fallback)
  faLandmark, // Para Transferencia Bancaria
  faCheckCircle, // Añadir icono de éxito
} from "@fortawesome/free-solid-svg-icons";
import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import { EmbeddedCheckout } from "../payments/StripeElementsWrapper";
import { loadStripe } from "@stripe/stripe-js";
import DropPdf from "../payments/ConfirmationTransferBank";
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";
import { postMpBuy } from "../services/MercadoPago.service";
import PaymentMercadoPago from "../payments/MercadoPagoConfirmation";
import { getPackageInfo } from "../services/BankTransfer.service";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const paymentOptions = [
  { id: "stripe", icon: faMoneyBillTransfer },
  { id: "mercadopago", icon: faCreditCard },
  { id: "bank_transfer_ars", icon: faLandmark },
  { id: "crypto", icon: faBitcoin },
];

const ffRegions = [
  { code: "ar", label: "regions.ar" },
  { code: "br", label: "regions.br" },
  { code: "us", label: "regions.us" },
  { code: "sg", label: "regions.sg" },
  { code: "in", label: "regions.in" }
];

export default function PurchaseForm() {
  const { t } = useTranslation();
  const [userId, setUserId] = useState("");
  const [region, setRegion] = useState("ar");
  const [diamondOptions, setDiamondOptions] = useState([]);
  const [playerId, setPlayerId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [playerIdError, setPlayerIdError] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isPackagesLoading, setIsPackagesLoading] = useState(false);

  useEffect(() => {
    getUserId();
    fetchPackages();
  }, []);

  function getUserId() {
    const userId = sessionStorage.getItem("userId");
    setUserId(userId);
  }

  function validatePlayerId(id) {
    if (!id) return t("form.error_playerId_required");
    if (!/^\d+$/.test(id)) return t("form.error_playerId_numeric");
    if (id.length < 8 || id.length > 10) return t("form.error_playerId_length");
    return "";
  }

  function handlePlayerIdChange(e) {
    const v = e.target.value;
    setPlayerId(v);
    setPlayerIdError(validatePlayerId(v));
  }

  function getSelectedPrice() {
    const opt = diamondOptions.find((o) => o.id === quantity);
    console.log(opt);
    return opt ? opt.price : "$0.00";
  }

  function getSelectedPriceInPesos() {
    const opt = diamondOptions.find((o) => o.id === quantity);
    if (!opt || !opt.price) return "$0.00";
    const numericAmount = parseFloat(opt.price.replace("$", "")) * 1120;
    return "$" + Math.round(numericAmount).toString();
  }

  async function fetchPackages(method = paymentMethod) {
    setIsPackagesLoading(true);
    try {
      const data = await getPackageInfo();

      const filtered = data.filter((pkg) => {
        if (method === "mercadopago")
          return pkg.origin === "MercadoPagoPackage";
        if (method === "bank_transfer_ars")
          return pkg.origin === "TransferPackage";
        return true;
      });

      const mapped = filtered.map((pkg) => ({
        id: pkg.id.toString(),
        label: pkg.diamonds.toString(),
        price: `$${(pkg.priceARS / 1120).toFixed(2)}`,
        bonus: 0,
        origin: pkg.origin,
      }));

      setDiamondOptions(mapped);
      if (mapped.length > 0) {
        setQuantity(mapped[0].id);
      } else {
        setQuantity("");
      }
    } catch (e) {
      console.error("Error loading packages", e);
    } finally {
      setIsPackagesLoading(false);
    }
  }

  async function handleBuy() {
    const err = validatePlayerId(playerId);
    setPlayerIdError(err);
    if (err) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/payments/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: quantity, playerId }),
      });
      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (e) {
      console.error(e);
      alert(t("form.error_creating_session"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="purchase-form" onSubmit={(e) => e.preventDefault()}>
      {/* Step 1 */}
      <div className="form-step">
        <div className="step-header">
          <span className="step-number">1</span>
          <h3 className="step-title">{t("form.step1_title")}</h3>
        </div>
        <div className="form-group">
          <div className="input-with-icon player-id-input-wrapper">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              value={playerId}
              onChange={handlePlayerIdChange}
              placeholder={t("form.playerId_placeholder")}
              className={playerIdError ? "input-error" : ""}
              maxLength={10}
              disabled={isSuccess}
            />
          </div>
          {playerIdError && !isSuccess && (
            <p className="error-message">{playerIdError}</p>
          )}
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="region-select"
            disabled={isSuccess}
          >
            {ffRegions.map((r) => (
              <option key={r.code} value={r.code}>
                {t(`purchase.regions.${r.code}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 3 */}
      <div className="form-step">
        <div className="step-header">
          <span className="step-number">2</span>
          <h3 className="step-title">{t("form.step3_title")}</h3>
        </div>
        <div className="form-group payment-options">
          {paymentOptions.map((opt) => {
            const isDisabled =
              opt.id === "stripe" ||
              opt.id === "crypto" ||
              isSuccess ||
              !quantity ||
              !playerId ||
              !!playerIdError;

            return (
              <button
                key={opt.id}
                type="button"
                className={`payment-button ${
                  paymentMethod === opt.id ? "selected" : ""
                }`}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) {
                    setPaymentMethod(opt.id);
                    fetchPackages(opt.id);
                    setQuantity("");
                  }
                }}
              >
                <FontAwesomeIcon icon={opt.icon} className="button-icon" />
                <span>{t(`form.payment.${opt.id}`)}</span>
              </button>
            );
          })}
        </div>

        {(!quantity || !playerId || playerIdError) && (
          <p className="error-message">
            {t("form.error_complete_previous_step")}
          </p>
        )}
      </div>

      {/* Step 2 */}
      <div className="form-step">
        <div className="step-header">
          <span className="step-number">3</span>
          <h3 className="step-title">{t("form.step2_title")}</h3>
        </div>

        <div className="form-group quantity-options">
          {isPackagesLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            diamondOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`quantity-button ${
                  quantity === opt.id ? "selected" : ""
                } ${opt.outOfStock ? "out-of-stock" : ""}`}
                disabled={
                  isSuccess ||
                  opt.outOfStock ||
                  !playerId ||
                  playerIdError ||
                  !paymentMethod
                }
                onClick={() => setQuantity(opt.id)}
              >
                <div className="button-main-content">
                  <FontAwesomeIcon icon={faGem} className="button-icon" />
                  <span>{t("form.diamonds_label", { label: opt.label })}</span>
                </div>
                {!opt.outOfStock && (
                  <>
                    {opt.bonus > 0 && (
                      <span className="bonus-text">
                        {t("form.bonus_text", { bonus: opt.bonus })}
                      </span>
                    )}
                    <span className="price">{opt.price}</span>
                  </>
                )}
                {opt.outOfStock && (
                  <span className="out-of-stock-text">{t("purchase.out_of_stock")}</span>
                )}
              </button>
            ))
          )}
        </div>

        {(!playerId || playerIdError) && (
          <p className="error-message">
            {playerIdError || t("form.error_playerId_required")}
          </p>
        )}
        {!paymentMethod && (
          <p className="error-message">{t("purchase.select_payment_first")}</p>
        )}
      </div>

      {/* Buy button for Stripe */}
      {paymentMethod === "stripe" && (
        <button
          type="button"
          className="purchase-button"
          disabled={!!playerIdError || !playerId || isLoading}
          onClick={handleBuy}
        >
          <FontAwesomeIcon icon={faShoppingCart} />{" "}
          {isLoading
            ? t("purchase.loading")
            : t("form.submit_button", { price: getSelectedPrice() })}
        </button>
      )}

      {paymentMethod === "mercadopago" && (
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

      {paymentMethod === "bank_transfer_ars" && (
        <>
          <div className="form-step">
            <div className="step-header">
              <span className="step-number">4</span>
              <h3 className="step-title">{t("purchase.transfer_data.title")}</h3>
            </div>
            <div className="form-group">
              <p>
                <strong>{t("purchase.transfer_data.amount")}</strong>{" "}
                {getSelectedPriceInPesos()}
              </p>
              <p>
                <strong>{t("purchase.transfer_data.alias")}</strong>{" "}
                <span className="alias-copy">ffdiamondzone</span>
              </p>
              <p>
                <strong>{t("purchase.transfer_data.cbu")}</strong>{" "}
                <span className="alias-copy">0000003100055519928336</span>
              </p>
              <p>
                <em>{t("purchase.transfer_data.reminder")}</em>
              </p>
            </div>
          </div>

          <div className="form-step">
            <div className="step-header">
              <span className="step-number">5</span>
              <h3 className="step-title">{t("upload.title")}</h3>
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
        <div className="success-message">
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>{t("form.success_message")}</span>
        </div>
      ) : null}

      <style jsx>{`
        .purchase-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 1300px; /* <<<--- Aumentar max-width (ej. a 1300px) */
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
          margin-bottom: 25px; /* Espacio debajo del header */
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
          flex-shrink: 0; /* Evitar que se achique */
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
          align-items: stretch; /* Hacer que los hijos ocupen el ancho */
        }

        label {
          font-weight: var(--font-weight-semibold);
          color: var(--text-color);
          display: flex;
          align-items: center;
        }

        input[type="text"] {
          padding: 14px 15px 14px 45px;
          border-radius: 8px;
          border: 1px solid var(--border-color-light);
          background-color: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: var(--font-size-md);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          width: 100%; /* Hacer que el input llene su contenedor */
          box-sizing: border-box; /* Incluir padding/border en el ancho */
        }

        input[type="text"]:focus {
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

        .quantity-options,
        .payment-options {
          display: grid;
          gap: 18px;
        }

        .quantity-options {
          grid-template-columns: repeat(
            auto-fit,
            minmax(150px, 1fr)
          ); /* Responsive grid */
        }

        .payment-options {
          grid-template-columns: repeat(
            auto-fit,
            minmax(180px, 1fr)
          ); /* Responsive grid */
        }

        .quantity-button,
        .payment-button {
          padding: 15px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px; /* Reducir gap para acomodar bonus */
          text-align: center;
          position: relative; /* Para posicionar bonus si es necesario */
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
          margin-bottom: 2px; /* Pequeño espacio antes del bonus/precio */
        }

        .quantity-button .button-icon {
          font-size: var(--font-size-md);
          width: auto; /* Ancho automático */
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
          display: inline-block; /* Para que el fondo se ajuste */
          margin-bottom: 4px; /* Espacio antes del precio */
        }

        .quantity-button .price {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-bold);
          color: var(--subtext-color);
          margin-top: 0; /* Quitar margen extra */
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
          transform: scale(1.03); /* Ligero zoom al seleccionar */
        }

        .quantity-button.selected .button-label {
          color: #fff;
          font-weight: var(--font-weight-bold);
        }

        .quantity-button.selected .price {
          color: #fff; /* Precio blanco al seleccionar */
        }

        .quantity-button.selected .bonus-text {
          color: #1a1a1a; /* Texto oscuro para contraste */
          background-color: #ffd700; /* Fondo dorado sólido */
        }

        .input-with-icon {
          position: relative;
          /* Quitar o comentar si no se quiere ancho completo */
          /* width: 100%; */
        }

        /* Nueva clase para forzar ancho completo */
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
          padding: 15px 30px; /* Asegurar buen tamaño */
          font-size: var(--font-size-lg);
          margin-top: 15px; /* Add some space above */
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

        @media (max-width: 600px) {
          .form-step {
            padding: 20px; /* Ajustar padding en móvil */
          }
          .quantity-options,
          .payment-options {
            grid-template-columns: 1fr; /* Stack options on small screens */
          }
        }

        /* Estilos comunes para ambos botones */
        .quantity-button,
        .payment-button {
          /* ... (common styles) ... */
        }

        /* Estilos específicos quantity */
        .quantity-button {
          /* ... */
        }
        .button-main-content {
          /* ... */
        }
        .quantity-button .button-icon {
          /* ... */
        }
        .quantity-button .button-label {
          /* ... */
        }
        .bonus-text {
          /* ... */
        }
        .quantity-button .price {
          /* ... */
        }

        /* Estilos específicos payment */
        .payment-button {
          /* ... (payment layout styles) ... */
        }
        .payment-button .button-icon {
          font-size: var(--font-size-lg);
          margin-bottom: 5px;
        }

        .payment-button span {
          font-size: var(--font-size-md);
        }

        /* Hover y Selected */
        .quantity-button:hover {
          /* ... (quantity hover styles) ... */
        }
        .quantity-button.selected {
          /* ... (quantity selected styles) ... */
        }
        .quantity-button.selected .button-label {
          /* ... */
        }
        .quantity-button.selected .price {
          /* ... */
        }
        .quantity-button.selected .bonus-text {
          /* ... */
        }
        .quantity-button.selected .button-icon {
          /* ... */
        }

        /* AÑADIR ESTILOS HOVER/SELECTED PARA PAYMENT BUTTON */
        .payment-button:hover {
          background-color: rgba(138, 43, 226, 0.1);
          border-color: rgba(138, 43, 226, 0.5);
          transform: translateY(-2px); /* Sutil hover */
        }

        .payment-button.selected {
          background-color: var(--accent-color);
          border-color: var(--accent-color);
          color: #fff;
          font-weight: var(--font-weight-semibold);
          box-shadow: 0 0 10px rgba(138, 43, 226, 0.4);
        }

        .payment-button.selected .button-icon {
          color: #fff; /* Asegurar icono blanco */
        }

        /* Estilos para botones deshabilitados */
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
          /* Quitar efectos hover */
          background-color: rgba(255, 255, 255, 0.03);
          border-color: var(--border-color-light);
          transform: none;
          box-shadow: none;
        }

        /* Estilos para Input deshabilitado */
        input[type="text"]:disabled {
          background-color: rgba(255, 255, 255, 0.05);
          opacity: 0.6;
          cursor: not-allowed;
          border-color: var(--border-color-light);
        }

        /* Estilo para el mensaje de éxito */
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

        /* Ocultar error si hay éxito */
        .error-message {
          /* ... (estilos existentes) */
          /* El ocultamiento se hace ahora con renderizado condicional */
        }

        /* <<<--- Añadir estilos para la fila de Player ID */
        .player-id-row {
          display: flex;
          gap: 15px; /* Espacio entre input y select */
          align-items: flex-start; /* Alinear arriba por si hay mensaje de error */
        }

        .player-id-input-wrapper {
          flex-grow: 1; /* Permitir que el input ocupe el espacio disponible */
          position: relative; /* Para el icono */
          display: flex; /* Alinear icono e input */
          align-items: center;
        }

        .player-id-input-wrapper input {
          width: 100%; /* Asegurar que el input llene el wrapper */
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--subtext-color);
          font-size: var(--font-size-sm);
        }

        input[type="text"] {
          width: 100%;
          padding: 12px 15px 12px 40px; /* Padding izquierdo para icono */
          border: 1px solid var(--border-color-light);
          background-color: rgba(0, 0, 0, 0.2);
          color: var(--text-color);
          border-radius: 6px;
          font-size: var(--font-size-md);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          box-sizing: border-box;
        }

        /* <<<--- Estilos para el nuevo selector de región */
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
          min-width: 150px; /* Ancho mínimo para que se lea "Select Region" */
          height: 48.8px; /* Igualar altura con input (puede requerir ajuste) */
          flex-shrink: 0; /* Evitar que se encoja */
        }

        .region-select:focus,
        input[type="text"]:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.3);
        }

        .region-select:disabled,
        input[type="text"]:disabled {
          background-color: rgba(50, 50, 50, 0.3);
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* Estilos para opciones del select (limitado por navegador) */
        .region-select option {
          background-color: var(--bg-color-dark);
          color: var(--text-color);
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

        /* Estilos para el botón sin stock */
        .quantity-button.out-of-stock {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: rgba(
            255,
            255,
            255,
            0.03
          ); /* Un poco más oscuro o diferente */
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
          color: var(--error-color); /* Usar color de error o uno específico */
          margin-top: 4px; /* Espacio respecto al contenido principal */
        }
      `}</style>
    </form>
  );
}
