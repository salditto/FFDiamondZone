import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, faShieldAlt, faRocket, faHeadset, 
  faCreditCard, faMoneyBillWave, faMobileAlt // Iconos para pagos
} from '@fortawesome/free-solid-svg-icons';

const About = () => {
  return (
    <div className="about-section">
      <div className="about-content-wrapper">
        <h2 className="about-title">
          <FontAwesomeIcon icon={faStar} className="title-icon" /> Why Choose Us?
        </h2>
        <p className="about-description">
          We are dedicated to providing the best experience for Free Fire players. Our platform offers instant diamond top-ups, secure transactions, exceptional customer support, and a wide range of payment options.
        </p>
        
        {/* Features Grid */}
        <h3 className="subsection-title features-title">Our Core Features</h3>
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

        {/* Payment Methods Section */}
        <div className="about-subsection payment-methods">
          <h3 className="subsection-title">Accepted Payment Methods</h3>
          <div className="payment-icons">
            <div className="payment-option">
              <FontAwesomeIcon icon={faCreditCard} />
              <span>Credit/Debit Cards</span>
            </div>
            <div className="payment-option">
              <FontAwesomeIcon icon={faMoneyBillWave} />
              <span>Online Banking</span>
            </div>
            <div className="payment-option">
              <FontAwesomeIcon icon={faMobileAlt} />
              <span>Mobile Wallets</span>
            </div>
            {/* Añadir más si es necesario */}
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
          background-color: #0a051a; /* Color de fondo base oscuro */
          color: #e0e0e0;
          box-sizing: border-box;
          left: 0; /* Asegurar que empieza en el borde izquierdo */
          right: 0; /* Asegurar que termina en el borde derecho */
        }

        .about-content-wrapper {
          max-width: 1400px; 
          width: 100%; /* Ocupar el ancho del padding de .about-section */
          margin: 0 auto; 
          padding: 0; /* Quitar padding interno */
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
          font-size: 2.8rem;
          color: #fff;
          margin-bottom: 20px;
          font-weight: 700;
          display: inline-flex; /* Para alinear icono y texto */
          align-items: center;
          gap: 15px;
          background: linear-gradient(90deg, #c371f9, #a951f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 8px rgba(138, 43, 226, 0.5));
        }

        .title-icon {
          font-size: 2.5rem;
          color: #a951f0; /* Color del icono */
          filter: none; /* Quitar filtro si no se quiere el gradiente */
          -webkit-text-fill-color: initial; /* Restaurar color */
        }
        
        .about-description {
          font-size: 1.1rem;
          line-height: 1.7;
          max-width: 750px;
          text-align: center;
          margin-bottom: 50px;
          background: rgba(10, 10, 20, 0.3);
          padding: 30px;
          border-radius: 15px;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(138, 43, 226, 0.1);
          margin-left: auto;
          margin-right: auto;
        }

        .about-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          width: 100%;
          margin-bottom: 50px;
        }

        .about-feature-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
          padding: 40px 25px; /* Aumentar padding vertical */
          border-radius: 8px;
          border: 1px solid rgba(138, 43, 226, 0.2);
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
          border-color: rgba(138, 43, 226, 0.6);
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
          border: 1px solid rgba(138, 43, 226, 0.5);
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .about-feature-card:hover .feature-icon-wrapper {
           transform: scale(1.1);
           box-shadow: 0 0 25px rgba(138, 43, 226, 0.5);
        }

        .feature-icon {
          font-size: 2rem; /* Tamaño del icono */
          color: #fff;
        }

        .about-feature-card h3 {
          font-size: 1.6rem;
          color: #fff;
          margin-bottom: 15px; /* Ajustar espacio */
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        .about-feature-card p {
          color: #bbb;
          font-size: 1rem;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 992px) {
          .about-features-grid {
             grid-template-columns: 1fr;
          }
           .about-description {
            max-width: 90%;
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
            font-size: 2.2rem;
          }
          .title-icon {
             font-size: 2rem;
          }
          .about-description {
            font-size: 1.05rem;
            padding: 25px;
          }
           .about-feature-card h3 {
             font-size: 1.4rem;
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
             font-size: 1.8rem;
          }
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

        .subsection-title {
          font-size: 1.8rem;
          color: #e0e0e0;
          margin-bottom: 20px;
          font-weight: 600;
          border-bottom: 1px solid rgba(138, 43, 226, 0.2);
          padding-bottom: 8px;
          display: inline-block;
        }
        
        .features-title {
           border-bottom: none; /* Quitar borde del título de features */
           margin-bottom: 30px; 
           text-align: center;
           width: 100%;
           display: block;
           margin-top: 0; /* Ajustar si se quitó la sección anterior */
        }

        .payment-methods {
          margin-top: 40px; /* Ajustar margen */
        }

        .payment-icons {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 0; /* Quitar margen inferior si se quitó la nota */
          flex-wrap: wrap; /* Para que quepan en móvil */
        }

        .payment-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #ccc;
          font-size: 1rem;
        }

        .payment-option svg {
          font-size: 2.5rem; /* Tamaño iconos de pago */
          color: var(--accent-color, #8a2be2);
        }

      `}</style>
    </div>
  );
};

export default About; 