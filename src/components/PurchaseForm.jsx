import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faGem, faShoppingCart, 
  faMoneyBillTransfer, // Para Wise (alternativa)
  faCreditCard, // Para MercadoPago (fallback)
  faLandmark, // Para Transferencia Bancaria
  faCheckCircle, // Añadir icono de éxito
} from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';

// Opciones de cantidad de diamantes (ejemplo) - CON BONUS
const diamondOptions = [
  { id: '100', label: '100', price: '$1.00', bonus: 10 },
  { id: '310', label: '310', price: '$3.00', bonus: 35 },
  { id: '520', label: '520', price: '$5.00', bonus: 60 },
  { id: '1060', label: '1060', price: '$10.00', bonus: 130 },
  { id: '2180', label: '2180', price: '$20.00', bonus: 300 },
  { id: '5600', label: '5600', price: '$50.00', bonus: 800 },
];

// Opciones de método de pago ACTUALIZADAS
const paymentOptions = [
  { id: 'wise', label: 'Wise', icon: faMoneyBillTransfer },
  { id: 'mercadopago', label: 'MercadoPago', icon: faCreditCard }, // Usar fallback si no hay icono específico
  { id: 'bank_transfer_ars', label: 'Bank Transfer (ARS)', icon: faLandmark },
  { id: 'crypto', label: 'Cryptocurrency', icon: faBitcoin },
];

const PurchaseForm = () => {
  const [playerId, setPlayerId] = useState('');
  const [quantity, setQuantity] = useState(diamondOptions[2].id); // Default a 520
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].id); // Default a Wise
  const [playerIdError, setPlayerIdError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // <<<--- Nuevo estado

  const validatePlayerId = (id) => {
    if (!id) {
      return 'Player ID is required.';
    }
    if (!/^[0-9]+$/.test(id)) {
      return 'Player ID must contain only numbers.';
    }
    if (id.length < 8 || id.length > 10) {
      return 'Player ID must be between 8 and 10 digits.';
    }
    return ''; // No error
  };

  const handlePlayerIdChange = (e) => {
    const newId = e.target.value;
    setPlayerId(newId);
    setPlayerIdError(validatePlayerId(newId));
  };
  
  const getSelectedPrice = () => {
      const selectedOption = diamondOptions.find(option => option.id === quantity);
      return selectedOption ? selectedOption.price : '$0.00';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No procesar si ya fue exitoso
    if (isSuccess) return; 
    
    const idError = validatePlayerId(playerId);
    setPlayerIdError(idError);

    if (!idError) {
      const selectedOption = diamondOptions.find(opt => opt.id === quantity);
      const selectedPaymentLabel = paymentOptions.find(p => p.id === paymentMethod)?.label || paymentMethod;
      console.log('Form Submitted:', { playerId, quantity: selectedOption?.label, bonus: selectedOption?.bonus, paymentMethod });
      
      // --- Quitar Alert y poner estado de Éxito ---
      // alert(`Purchase Submitted!...`); 
      setIsSuccess(true); // <<<--- Establecer éxito
      // Aquí iría la lógica real de enviar datos...

    } else {
      console.log('Form validation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="purchase-form">
      
      {/* Step 1: Player ID */}
      <div className="form-step">
        <div className="step-header">
          <span className="step-number">1</span>
          <h3 className="step-title">Enter Your Player ID</h3>
        </div>
        <div className="form-group">
          <label htmlFor="playerId" className="sr-only">Player ID</label>
          <div className="input-with-icon full-width-input-container">
             <FontAwesomeIcon icon={faUser} className="input-icon" />
             <input
               type="text"
               id="playerId"
               value={playerId}
               onChange={handlePlayerIdChange}
               placeholder="Enter your 8-10 digit Player ID"
               className={playerIdError ? 'input-error' : ''}
               maxLength="10"
               aria-describedby={playerIdError ? "player-id-error" : undefined}
               disabled={isSuccess} // <<<--- Deshabilitar en éxito
             />
          </div>
          {playerIdError && !isSuccess && <p id="player-id-error" className="error-message">{playerIdError}</p>}
        </div>
      </div>

      {/* Step 2: Quantity */}
      <div className="form-step">
        <div className="step-header">
           <span className="step-number">2</span>
           <h3 className="step-title">Select Diamond Quantity</h3>
        </div>
        <div className="form-group">
          <div className="quantity-options">
            {diamondOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`quantity-button ${quantity === option.id ? 'selected' : ''}`}
                onClick={() => !isSuccess && setQuantity(option.id)} // <<<--- Prevenir cambio en éxito
                disabled={isSuccess} // <<<--- Deshabilitar en éxito
              >
                <div className="button-main-content">
                   <FontAwesomeIcon icon={faGem} className="button-icon" />
                   <span className="button-label">{option.label} Diamonds</span> 
                </div>
                {option.bonus > 0 && (
                    <span className="bonus-text">+ {option.bonus} Bonus!</span>
                )}
                <span className="price">{option.price}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3: Payment Method */}
      <div className="form-step">
         <div className="step-header">
           <span className="step-number">3</span>
           <h3 className="step-title">Choose Payment Method</h3>
         </div>
        <div className="form-group">
           {/* El label ahora está en el header */} 
          <div className="payment-options">
            {paymentOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`payment-button ${paymentMethod === option.id ? 'selected' : ''}`}
                onClick={() => !isSuccess && setPaymentMethod(option.id)} // <<<--- Prevenir cambio en éxito
                disabled={isSuccess} // <<<--- Deshabilitar en éxito
              >
                <FontAwesomeIcon icon={option.icon} className="button-icon"/>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="btn btn-primary purchase-button" 
        disabled={!!playerIdError || !playerId || isSuccess} // <<<--- Deshabilitar en éxito
      >
         <FontAwesomeIcon icon={faShoppingCart} /> Purchase Now ({getSelectedPrice()})
      </button>
      
      {/* --- Mensaje de Éxito Condicional --- */} 
      {isSuccess && (
          <div className="success-message">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>Purchase successful! Your diamonds are on the way.</span>
          </div>
      )}

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
          gap: 8px;
          font-size: var(--font-size-md);
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

        .quantity-options, .payment-options {
          display: grid;
          gap: 18px;
        }
        
        .quantity-options {
           grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Responsive grid */
        }

        .payment-options {
           grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* Responsive grid */
        }

        .quantity-button, .payment-button {
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
          background: linear-gradient(135deg, var(--accent-color), var(--accent-color-2));
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
          .quantity-options, .payment-options {
             grid-template-columns: 1fr; /* Stack options on small screens */
          }
        }

        /* Estilos comunes para ambos botones */
        .quantity-button, .payment-button {
          /* ... (common styles) ... */
        }
        
        /* Estilos específicos quantity */
        .quantity-button { /* ... */ }
        .button-main-content { /* ... */ }
        .quantity-button .button-icon { /* ... */ }
        .quantity-button .button-label { /* ... */ }
        .bonus-text { /* ... */ }
        .quantity-button .price { /* ... */ }
        
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
        .quantity-button.selected .button-label { /* ... */ }
        .quantity-button.selected .price { /* ... */ }
        .quantity-button.selected .bonus-text { /* ... */ }
        .quantity-button.selected .button-icon { /* ... */ }
        
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

      `}</style>
    </form>
  );
};

export default PurchaseForm; 