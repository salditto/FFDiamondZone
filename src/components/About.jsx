import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, faShieldAlt, faRocket, faHeadset, 
  faMoneyBillTransfer, // Para Wise
  faCreditCard, // Para MP
  faLandmark, // Para Transferencia
} from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'; // Importar Bitcoin de brands
import freefireImage2 from '../assets/img/freefire2.png'; // <<<--- Importar la nueva imagen

// Definir las opciones aquí también para consistencia
const paymentOptions = [
  { id: 'wise', label: 'Wise', icon: faMoneyBillTransfer },
  { id: 'mercadopago', label: 'MercadoPago', icon: faCreditCard }, 
  { id: 'bank_transfer_ars', label: 'Bank Transfer (ARS)', icon: faLandmark },
  { id: 'crypto', label: 'Cryptocurrency', icon: faBitcoin },
];

const About = () => {
  return (
    <div className="about-section">
      <div className="about-content-wrapper">
        <h2 className="about-title">
          <FontAwesomeIcon icon={faStar} className="title-icon" /> Why Choose Us?
        </h2>
        
        {/* Contenedor para el layout de dos columnas */}
        <div className="about-intro-layout">
          {/* Columna Izquierda: Texto */}
          <div className="about-text-column">
            <p className="about-description">
              We are dedicated to providing the best experience for Free Fire players. Our platform offers instant diamond top-ups and secure transactions. We accept a wide range of payment methods, including <strong>Wise</strong>, <strong>MercadoPago</strong>, <strong>Bank Transfers (ARS)</strong>, and <strong>Cryptocurrency</strong>. Choose FF Diamond Zone for a seamless and flexible top-up process!
            </p>
          </div>
          {/* Columna Derecha: Imagen */}
          <div className="about-image-column">
            <img src={freefireImage2} alt="Free Fire Character" className="about-image" />
          </div>
        </div>
        
        {/* Features Grid */}
        <h3 className="section-title">Our Core Features</h3>
        <div className="about-features-grid">
           {/* Cards (Security, Fast Delivery, Support) - Sin cambios */}
           <div className="about-feature-card">
             <div className="feature-icon-wrapper">
               <FontAwesomeIcon icon={faShieldAlt} className="feature-icon" />
             </div>
             <h3>Fortress Security</h3>
             <p>Your account and payment details are protected with top-tier security measures.</p>
           </div>
           <div className="about-feature-card">
             <div className="feature-icon-wrapper">
               <FontAwesomeIcon icon={faRocket} className="feature-icon" />
             </div>
             <h3>Instant Delivery</h3>
             <p>Receive your diamonds immediately after payment confirmation. No waiting!</p>
           </div>
           <div className="about-feature-card">
             <div className="feature-icon-wrapper">
               <FontAwesomeIcon icon={faHeadset} className="feature-icon" />
             </div>
             <h3>Dedicated Support</h3>
             <p>Our customer support team is ready to assist you with any questions or issues.</p>
           </div>
        </div>

      </div>

      {/* Background Effects for About Section */}
      <div className="about-background-effects">
        <div className="about-bg-glow-1"></div>
        <div className="about-bg-glow-2"></div>
        <div className="about-bg-pattern"></div>
        {/* Añadir líneas si se desean también */}
        {/* <div className="about-bg-lines"></div> */}
      </div>

      <style jsx>{`
        .about-section {
          position: relative;
          width: 100vw; /* Cambiar a 100vw para forzar el ancho completo del viewport */
          min-height: 100vh; /* Altura mínima de 100vh */
          padding: 80px 20px; /* Añadir padding horizontal aquí */
          display: flex; /* Usar flex para centrar */
          align-items: center; /* Centrar verticalmente el wrapper */
          overflow: hidden;
          color: var(--text-color);
          background-color: var(--bg-color-dark);
          box-sizing: border-box;
          left: 0; /* Asegurar que empieza en el borde izquierdo */
          right: 0; /* Asegurar que termina en el borde derecho */
        }

        .about-content-wrapper {
          max-width: 1300px; /* Igual que PurchaseForm */
          width: 100%;
          margin: 0 auto;
          padding: 0 30px; /* Padding horizontal consistente */
          background-color: transparent; /* <<<--- Quitar fondo */
          border-radius: 0; /* <<<--- Quitar borde redondeado */
          border: none; /* <<<--- Quitar borde */
          box-shadow: none; /* <<<--- Quitar sombra */
          backdrop-filter: none; /* <<<--- Quitar blur */
          -webkit-backdrop-filter: none;
          position: relative;
          z-index: 2;
          text-align: center; 
        }

        .about-title {
          font-size: var(--font-size-xxxl);
          color: #fff;
          margin-bottom: 20px;
          font-weight: var(--font-weight-bold);
          display: inline-flex; /* Para alinear icono y texto */
          align-items: center;
          gap: 15px;
          background: linear-gradient(90deg, #c371f9, #a951f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 8px rgba(138, 43, 226, 0.5));
        }

        .title-icon {
          font-size: var(--font-size-xxxl);
          color: var(--accent-color);
          filter: none; /* Quitar filtro si no se quiere el gradiente */
          -webkit-text-fill-color: initial; /* Restaurar color */
        }
        
        .about-intro-layout {
          display: flex;
          justify-content: center; /* Centrar todo el grupo */
          align-items: center;  /* Alinear verticalmente */
          gap: 24px;            /* Espacio reducido entre texto e imagen */
          margin-bottom: 60px;
        }

        .about-text-column {
           flex: 0 0 auto;       /* Tamaño automático según el contenido */
           max-width: 450px;     /* Limitar la anchura del bloque de texto */
           display: flex;
           flex-direction: column;
           justify-content: center; /* Centrar verticalmente el párrafo */
        }

        .about-image-column {
           flex: 0 0 auto;       /* Tamaño automático según la imagen */
           display: flex;
           justify-content: center;
           align-items: center;
        }

        .about-image {
          max-width: 350px;
          width: 100%;
          height: auto;
          max-height: 70vh;
          object-fit: contain;
          filter: drop-shadow(0 0 15px rgba(138, 43, 226, 0.4));
          border-radius: 0;
          box-shadow: none;
          border: none;
        }

        .about-description {
          font-size: var(--font-size-lg);
          line-height: var(--line-height-loose);
          color: var(--subtext-color);
          text-align: center; 
          margin: 0;
          padding: 0 20px;    /* Espacio interno para no pegar a los bordes de la columna */
          background: none;
          border-radius: 0;
          backdrop-filter: none;
          border: none;
        }
        
        .about-description strong {
            color: var(--accent-color);
            font-weight: var(--font-weight-semibold);
        }

        .section-title {
            margin-top: 0; /* Resetear margen si es necesario */
        }

        .about-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); 
          gap: 40px; 
          width: 100%;
          margin: 0 0 60px 0;
          box-sizing: border-box;
        }

        .about-feature-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
          padding: 40px 25px; /* Aumentar padding vertical */
          border-radius: 8px;
          border: 1px solid var(--border-color-accent);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-align: center;
          backdrop-filter: blur(3px);
          position: relative;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .about-feature-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, transparent 60%);
            transform: translate(100%, 100%) scale(0);
            transition: transform 0.6s ease;
            opacity: 0;
            border-radius: 50%;
        }

        .about-feature-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 15px 30px rgba(138, 43, 226, 0.25);
          border-color: var(--accent-color);
        }
        
        .about-feature-card:hover::before {
          transform: translate(0, 0) scale(3);
          opacity: 1;
        }

        .feature-icon-wrapper {
          width: 80px; /* Tamaño del círculo */
          height: 80px;
          margin: 0 auto 25px auto; /* Espacio debajo */
          border-radius: 50%;
          background: linear-gradient(145deg, rgba(138, 43, 226, 0.2), rgba(138, 43, 226, 0.4));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(138, 43, 226, 0.3);
          border: 1px solid var(--accent-color-2);
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .about-feature-card:hover .feature-icon-wrapper {
           transform: scale(1.1);
           box-shadow: 0 0 25px rgba(138, 43, 226, 0.5);
        }

        .feature-icon {
          font-size: var(--font-size-xl);
          color: #fff;
        }

        .about-feature-card h3 {
          font-size: var(--font-size-xl);
          color: var(--text-color);
          margin-bottom: 15px;
          font-weight: var(--font-weight-bold);
          position: relative;
          z-index: 1;
        }

        .about-feature-card p {
          color: var(--subtext-color);
          font-size: var(--font-size-md);
          line-height: var(--line-height-base);
          position: relative;
          z-index: 1;
        }

        @media (max-width: 992px) {
          .about-intro-layout {
            flex-direction: column; /* Apilar en pantallas medianas/pequeñas */
            text-align: center; /* Centrar texto al apilar */
            gap: 30px;
          }
          .about-image-column {
            flex-basis: auto; /* Resetear base */
            width: 60%; /* Ajustar ancho en móvil */
            max-width: 300px; /* Limitar tamaño en móvil */
          }
          .about-text-column {
             order: 2; /* Poner texto debajo de la imagen en móvil */
             padding-right: 0; /* Quitar padding en móvil */
          }
           .about-description {
              text-align: center; /* Centrar descripción en móvil */
           }
        }

        @media (max-width: 1450px) { /* Ajustar breakpoint si es necesario */
          .about-content-wrapper {
             padding: 40px; /* Reducir padding en pantallas medianas */
          }
        }

        @media (max-width: 768px) {
          .about-section {
            padding: 60px 0; /* Ajustar padding para móvil */
          }
          .about-content-wrapper {
            padding: 30px; /* Mantener padding reducido en móvil */
          }
          .about-title {
            font-size: var(--font-size-xxl);
          }
          .title-icon {
             font-size: var(--font-size-xxl);
          }
          .about-description {
            font-size: var(--font-size-md);
            padding: 25px;
          }
           .about-feature-card h3 {
             font-size: var(--font-size-md);
          }
           .about-feature-card p {
              font-size: var(--font-size-xs); /* Más pequeño en móvil */
           }
           .about-section {
             /* Podríamos ajustar el padding si es necesario en móvil */
           }
          .feature-icon-wrapper {
             width: 70px;
             height: 70px;
             margin-bottom: 20px;
          }
          .feature-icon {
             font-size: var(--font-size-lg);
          }
          .about-features-grid {
             grid-template-columns: 1fr; /* Una columna en móvil */
        }

        /* Estilos para los efectos de fondo */
        .about-background-effects {
           position: absolute;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           overflow: hidden;
           z-index: 0; /* Detrás del contenido */
        }

        .about-bg-glow-1 {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 60%;
          height: 60%;
          background: radial-gradient(ellipse, rgba(138, 43, 226, 0.15), transparent 70%);
          filter: blur(50px);
          animation: pulse-glow 12s ease-in-out infinite alternate;
        }

        .about-bg-glow-2 {
          position: absolute;
          bottom: -30%;
          right: -20%;
          width: 70%;
          height: 70%;
          background: radial-gradient(ellipse, rgba(218, 112, 214, 0.1), transparent 70%);
          filter: blur(60px);
          animation: pulse-glow 10s ease-in-out infinite alternate-reverse;
        }

        .about-bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(138, 43, 226, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(138, 43, 226, 0.04) 1px, transparent 1px);
          background-size: 45px 45px;
          opacity: 0.3;
        }
        
        @keyframes pulse-glow {
           0% { opacity: 0.4; transform: scale(1); }
           100% { opacity: 0.8; transform: scale(1.1); }
        }

        .about-subsection {
          margin-bottom: 40px; /* Ajustar margen */
          padding: 0;
          background: transparent;
          border: none;
        }

        .section-title {
           margin-bottom: 30px; 
           text-align: center;
           width: 100%;
           display: block;
           margin-top: 0; /* Ajustar si se quitó la sección anterior */
        }

        .about-subsection.payment-methods {
          margin: 0 auto 80px; 
          width: 100%; 
          padding: 0 20px;
        }

        .payment-icons {
          display: flex;
          justify-content: center; 
          gap: 80px; /* <<<--- Incrementar más gap horizontal */
          margin-top: 40px; 
          overflow-x: auto; 
          padding-bottom: 15px; 
          align-items: flex-start; 
          flex-wrap: nowrap; /* <<<--- Añadir esto */
        }

        .payment-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px; 
          color: var(--subtext-color);
          font-size: var(--font-size-xxxl); /* <<<--- Cambiar a xxxl */
          transition: transform 0.3s ease; 
          flex-shrink: 0; 
          min-width: 120px; 
        }
        .payment-option:hover {
          transform: scale(1.1);
        }

      `}</style>
    </div>
  );
};

export default About; 