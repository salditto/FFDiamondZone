import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        
        {/* Section 1: About */}
        <div className="footer-section about">
          <img src="/ffdiamond-logo.svg" alt="FF Diamond Zone Logo" className="footer-logo-svg" />
          <p className="footer-description">
             The premier destination for Free Fire diamonds. Fast, secure, and reliable service for gamers.
          </p>
           <div className="social-links">
             <a href="#" aria-label="Facebook" className="social-link"><FontAwesomeIcon icon={faFacebookF} /></a>
             <a href="#" aria-label="Twitter" className="social-link"><FontAwesomeIcon icon={faTwitter} /></a>
             <a href="#" aria-label="Instagram" className="social-link"><FontAwesomeIcon icon={faInstagram} /></a>
             <a href="#" aria-label="Discord" className="social-link"><FontAwesomeIcon icon={faDiscord} /></a>
           </div>
        </div>
        
        {/* Section 2: Quick Links */}
        <div className="footer-section links">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#buy-diamonds">Buy Diamonds</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        
        {/* Section 3: Contact Us */}
        <div className="footer-section contact">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="contact-info">
            <li><FontAwesomeIcon icon={faEnvelope} className="contact-icon" /> support@ffdiamondzone.com</li>
            <li><FontAwesomeIcon icon={faClock} className="contact-icon" /> 24/7 Customer Support</li>
          </ul>
        </div>

      </div>
      
      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} FF Diamond Zone. All rights reserved.</p>
         {/* <p className="disclaimer">FF Diamond Zone is not affiliated...</p> */}
      </div>
      
      <style jsx>{`
        .footer {
          background-color: var(--bg-color-dark);
          padding: 30px 30px 20px; /* Reducir padding vertical */
          border-top: 1px solid var(--border-color-accent);
          position: relative;
          z-index: 1;
          width: 100%;
          box-sizing: border-box;
        }
        
        .footer-content {
          display: flex;
          flex-wrap: wrap; /* Permitir que las secciones se envuelvan */
          justify-content: space-between; 
          gap: 30px; /* Espacio entre secciones */
          max-width: 1400px; 
          margin: 0 auto; 
          width: 100%; 
        }
        
        .footer-section {
           flex: 1 1 250px; /* Flex-grow, flex-shrink, base width */
           margin-bottom: 20px; /* Reducir margen inferior */
        }

        .footer-section.about {
          /* Estilos específicos si son necesarios */
        }

        .footer-logo-svg {
          height: 40px; /* Restaurar tamaño logo */
          width: auto;
          margin-bottom: 15px; /* Espacio bajo el logo */
        }
        
        .footer-description {
          color: var(--subtext-color);
          margin-bottom: 20px;
          line-height: var(--line-height-base);
          font-size: var(--font-size-sm);
        }
        
        .social-links {
           display: flex;
           gap: 15px;
        }
        
        .social-link {
          color: var(--subtext-color);
          font-size: var(--font-size-lg); 
          transition: color 0.3s ease, transform 0.3s ease;
          display: flex; /* Para centrar el icono si tuviera fondo */
          align-items: center;
          justify-content: center;
          /* background-color: rgba(138, 43, 226, 0.1); opcional */
          /* border-radius: 50%; opcional */
          /* width: 36px; opcional */
          /* height: 36px; opcional */
        }
        
        .social-link:hover {
          color: var(--accent-color);
          transform: scale(1.1);
        }
        
        .footer-heading {
          color: var(--text-color);
          font-size: var(--font-size-lg); /* Más grande */
          margin-bottom: 20px;
          font-weight: var(--font-weight-semibold);
          position: relative;
          padding-bottom: 10px;
        }
        
        .footer-heading::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 50px;
          height: 2px;
          background: linear-gradient(to right, var(--accent-color), var(--accent-color-2));
        }
        
        .footer-links {
          list-style: none;
          padding: 0;
        }
        
        .footer-links li {
          margin-bottom: 12px; /* Ajustar espacio */
        }
        
        .footer-links a {
          color: var(--subtext-color);
          transition: all 0.3s;
          font-size: var(--font-size-md);
          display: inline-block;
        }
        
        .footer-links a:hover {
          color: var(--accent-color);
          transform: translateX(5px);
        }
        
        .contact-info {
          list-style: none;
          padding: 0;
        }
        
        .contact-info li {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          color: var(--subtext-color);
          font-size: var(--font-size-md);
        }
        
        .contact-icon {
          margin-right: 12px; /* Espacio icono-texto */
          font-size: var(--font-size-md);
          color: var(--accent-color); /* Dar color al icono */
          width: 20px; /* Ancho fijo para alinear texto */
          text-align: center;
        }
        
        .footer-bottom {
          text-align: center;
          margin-top: 20px; /* Reducir margen superior */
          padding-top: 15px; /* Reducir padding superior */
          border-top: 1px solid var(--border-color-light);
          color: var(--subtext-color);
          font-size: var(--font-size-sm);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
           /* .footer-content ya es wrap, se ajustará solo */
           .footer-section {
             flex-basis: 100%; /* Ocupar todo el ancho en móvil */
             margin-bottom: 40px; /* Más espacio vertical */
             text-align: center; /* Centrar contenido de secciones */
           }
           .footer-logo-svg {
              margin-left: auto;
              margin-right: auto;
           }
           .social-links {
             justify-content: center;
           }
           .footer-heading::after {
             left: 50%; /* Centrar línea bajo título */
             transform: translateX(-50%);
           }
           .contact-info li {
             justify-content: center; /* Centrar items de contacto */
           }
        }
      `}</style>
    </footer>
  );
};

export default Footer; 