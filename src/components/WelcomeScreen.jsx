import React from 'react';
import freefireLogo from '../assets/img/freefire.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faLock, faCoins, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const WelcomeScreen = ({ onBuyClick, onFAQClick, onScrollIndicatorClick }) => {
  return (
    <div className="welcome-screen">
      <div className="background-effects">
        <div className="bg-gradient-top"></div>
        <div className="bg-gradient-bottom"></div>
        <div className="bg-grid"></div>
        <div className="bg-glow-left"></div>
        <div className="bg-glow-right"></div>
        <div className="bg-noise"></div>
        <div className="bg-lines"></div>
        {[...Array(30)].map((_, i) => (
          <div key={i} className={`bg-particle particle-${i + 1}`}></div>
        ))}
      </div>
      
      <div className="hero-section">
        <div className="hero-column hero-image-column">
          <img src={freefireLogo} alt="Free Fire Logo" className="freefire-logo" />
        </div>
        
        <div className="hero-column hero-content-column">
          <div className="hero-content">
            <div className="hero-brand-logo">
              <img src="/ffdiamond-logo.svg" alt="FF Diamond Zone Logo" className="hero-logo-svg" />
            </div>
            
            <p className="hero-subtitle">Get your diamonds quickly and safely. Dominate the game with the best prices.</p>
            
            <div className="hero-features">
              <div className="feature">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faBolt} />
                </div>
                <div className="feature-text">Instant Delivery</div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <div className="feature-text">Secure Payment</div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faCoins} />
                </div>
                <div className="feature-text">Best Prices</div>
              </div>
            </div>
            
            <button 
              className="btn btn-primary hero-button"
              onClick={onBuyClick}
            >
              Buy Diamonds Now
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div 
        className="scroll-down-indicator"
        onClick={onScrollIndicatorClick}
      >
        <span>Scroll Down</span>
        <FontAwesomeIcon icon={faChevronDown} className="scroll-icon" />
      </div>

      <style jsx>{`
        .welcome-screen {
          width: 100vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #11092e 0%, #02041d 100%);
          margin: 0;
          padding: 0;
          left: 0;
          right: 0;
          height: 100vh;
          min-height: 100vh;
        }
        
        .background-effects {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .bg-gradient-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: radial-gradient(circle at top right, rgba(128, 0, 255, 0.2), transparent 70%);
          animation: pulse-gradient 8s ease-in-out infinite alternate;
        }
        
        .bg-gradient-bottom {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 60%;
          background: radial-gradient(circle at bottom left, rgba(0, 200, 255, 0.15), transparent 70%);
          animation: pulse-gradient 8s ease-in-out infinite alternate-reverse;
        }
        
        .bg-glow-left {
          position: absolute;
          top: 15%;
          left: -10%;
          width: 50%;
          height: 70%;
          background: radial-gradient(ellipse, rgba(128, 0, 255, 0.15), transparent 70%);
          filter: blur(40px);
          opacity: 0.7;
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .bg-glow-right {
          position: absolute;
          top: 30%;
          right: -10%;
          width: 40%;
          height: 60%;
          background: radial-gradient(ellipse, rgba(0, 200, 255, 0.1), transparent 70%);
          filter: blur(40px);
          opacity: 0.5;
          animation: float-slow 15s ease-in-out infinite reverse;
        }
        
        .bg-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(128, 0, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128, 0, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.5;
        }
        
        .bg-noise {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        
        .bg-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          opacity: 0.1;
        }
        
        .bg-lines::before, 
        .bg-lines::after {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background-image: linear-gradient(0deg, transparent 0%, transparent 49%, rgba(128, 0, 255, 0.3) 50%, transparent 51%, transparent 100%);
          background-size: 40px 40px;
          animation: bg-lines-move 15s linear infinite;
        }
        
        .bg-lines::after {
          opacity: 0.5;
          background-image: linear-gradient(90deg, transparent 0%, transparent 49%, rgba(0, 200, 255, 0.3) 50%, transparent 51%, transparent 100%);
          animation-duration: 20s;
        }
        
        @keyframes bg-lines-move {
          0% {
            transform: rotate(0) scale(1);
          }
          100% {
            transform: rotate(1deg) scale(1.1);
          }
        }
        
        .bg-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(128, 0, 255, 0.5);
          box-shadow: 0 0 10px 2px rgba(128, 0, 255, 0.3);
        }
        
        ${[...Array(30)].map((_, i) => `
          .particle-${i + 1} {
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${0.3 + Math.random() * 0.7};
            width: ${2 + Math.random() * 4}px;
            height: ${2 + Math.random() * 4}px;
            animation: 
              particle-glow ${5 + Math.random() * 10}s ease-in-out infinite alternate,
              particle-float ${30 + Math.random() * 20}s ease-in-out infinite;
            animation-delay: ${-Math.random() * 10}s;
          }
        `).join('')}
        
        @keyframes particle-glow {
          0% {
            opacity: 0.2;
            transform: scale(1);
          }
          100% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }
        
        @keyframes particle-float {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(${-30 + Math.random() * 60}px, ${-30 + Math.random() * 60}px);
          }
          50% {
            transform: translate(${-30 + Math.random() * 60}px, ${-30 + Math.random() * 60}px);
          }
          75% {
            transform: translate(${-30 + Math.random() * 60}px, ${-30 + Math.random() * 60}px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        
        @keyframes pulse-gradient {
          0% {
            opacity: 0.5;
          }
          100% {
            opacity: 0.9;
          }
        }
        
        @keyframes float-slow {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-5%, 3%);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        
        .hero-section {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          flex-grow: 1;
          max-width: 100%;
          margin: 0;
          padding: 80px 40px 40px;
          position: relative;
          z-index: 2;
          box-sizing: border-box;
        }
        
        .hero-column {
          display: flex;
          align-items: center;
        }
        
        .hero-image-column {
          flex: 2;
          position: relative;
          justify-content: center;
          padding-right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }
        
        .hero-content-column {
          flex: 0.6;
          padding-left: 10px;
          padding-right: 5%;
          align-self: center;
        }
        
        .hero-content {
          max-width: 100%;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .hero-brand-logo {
          margin-bottom: 30px;
          width: 100%;
          max-width: 500px;
        }

        .hero-logo-svg {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 0 15px rgba(138, 43, 226, 0.6));
        }
        
        .hero-subtitle {
          font-size: 1.5rem;
          margin-bottom: 40px;
          color: #f0f0f0;
          max-width: 600px;
        }
        
        .hero-features {
          display: flex;
          gap: 30px;
          margin-bottom: 50px;
          justify-content: center;
        }
        
        .feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .feature-icon {
          font-size: 1.8rem;
          margin-bottom: 10px;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(138, 43, 226, 0.1);
          border: 1px solid rgba(138, 43, 226, 0.3);
          box-shadow: 0 0 15px rgba(138, 43, 226, 0.3);
          color: #fff;
        }
        
        .feature-text {
          font-weight: 500;
          color: #f0f0f0;
        }
        
        .hero-button {
          font-size: 1.5rem;
          padding: 15px 40px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          animation: pulse 2s infinite;
          margin-top: 20px;
        }
        
        .freefire-logo {
          width: 160%;
          max-height: none;
          height: auto;
          object-fit: contain;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 30px rgba(138, 43, 226, 0.9));
          transform: scale(1.2);
          margin-top: 5%;
          animation: logo-float 6s ease-in-out infinite alternate;
        }
        
        @keyframes logo-float {
          0% {
            transform: scale(1.2) translateY(0);
          }
          100% {
            transform: scale(1.2) translateY(-15px);
          }
        }
        
        @keyframes glow {
          from {
            text-shadow: 0 0 10px rgba(138, 43, 226, 0.7), 0 0 20px rgba(138, 43, 226, 0.5);
          }
          to {
            text-shadow: 0 0 15px rgba(218, 112, 214, 0.7), 0 0 30px rgba(218, 112, 214, 0.5);
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 10px rgba(138, 43, 226, 0.7), 0 0 20px rgba(138, 43, 226, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(218, 112, 214, 0.7), 0 0 30px rgba(218, 112, 214, 0.3);
          }
          100% {
            box-shadow: 0 0 10px rgba(138, 43, 226, 0.7), 0 0 20px rgba(138, 43, 226, 0.3);
          }
        }
        
        @media (max-width: 1200px) {
          .hero-title {
            font-size: 4rem;
          }
          
          .hero-title-main {
            font-size: 2.5rem;
          }
          
          .hero-logo-text {
            font-size: 3.5rem;
          }
          
          .hero-logo-zone {
            font-size: 2.8rem;
            letter-spacing: 4px;
          }
          
          .freefire-logo {
            width: 150%;
            transform: scale(1.1);
            margin-top: 3%;
            animation: logo-float-md 6s ease-in-out infinite alternate;
          }
          
          @keyframes logo-float-md {
            0% {
              transform: scale(1.1) translateY(0);
            }
            100% {
              transform: scale(1.1) translateY(-12px);
            }
          }
        }
        
        @media (max-width: 992px) {
          .hero-section {
            flex-direction: column;
            height: auto;
            padding: 100px 20px 40px;
          }
          
          .hero-column {
            width: 100%;
          }
          
          .hero-image-column {
            height: auto;
            padding-right: 0;
            margin-bottom: 0;
          }
          
          .hero-content-column {
            padding-left: 0;
            padding-right: 0;
            text-align: center;
            margin-bottom: 40px;
          }
          
          .hero-content {
            max-width: 100%;
            align-items: center;
            text-align: center;
          }
          
          .hero-brand-logo {
            max-width: 400px;
          }
          
          .hero-subtitle, .hero-features, .hero-button {
            align-self: center;
            text-align: center;
          }
          
          .hero-features {
            justify-content: center;
          }
          
          .freefire-logo {
            width: 140%;
            transform: scale(1);
            margin-top: 20px;
            animation: logo-float-sm 6s ease-in-out infinite alternate;
          }
          
          @keyframes logo-float-sm {
            0% {
              transform: scale(1) translateY(0);
            }
            100% {
              transform: scale(1) translateY(-10px);
            }
          }
          
          .bg-lines {
            opacity: 0.07;
          }
          
          .scroll-down-indicator {
            bottom: 25px;
            padding: 10px 18px;
            font-size: 0.9rem;
          }
          .scroll-icon {
            font-size: 1.1rem;
            margin-left: 6px;
          }
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-title-main {
            font-size: 2rem;
          }
          
          .hero-logo-text {
            font-size: 2.8rem;
          }
          
          .hero-logo-zone {
            font-size: 2rem;
            letter-spacing: 3px;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .hero-features {
            flex-direction: column;
            gap: 20px;
          }
          
          .hero-button {
            font-size: 1.2rem;
            padding: 12px 30px;
          }
          
          .freefire-logo {
            width: 130%;
            height: auto;
            transform: scale(1);
            margin-top: 15px;
            animation: logo-float-sm 6s ease-in-out infinite alternate;
          }
          
          .hero-brand-logo {
            max-width: 350px;
          }
          
          .bg-lines {
            opacity: 0.05;
          }
          
          .scroll-down-indicator {
            bottom: 20px;
            padding: 8px 15px;
            font-size: 0.85rem;
          }
          .scroll-icon {
            font-size: 1rem;
            margin-left: 5px;
          }
        }

        .scroll-down-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(138, 43, 226, 0.2);
          border: 1px solid rgba(138, 43, 226, 0.4);
          color: #e0e0e0;
          padding: 12px 25px;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          z-index: 10;
          cursor: pointer;
          backdrop-filter: blur(5px);
          transition: background-color 0.3s ease, transform 0.3s ease;
          animation: subtle-bounce 2.5s infinite ease-in-out;
        }

        .scroll-down-indicator:hover {
          background-color: rgba(138, 43, 226, 0.4);
          transform: translateX(-50%) scale(1.05);
        }

        .scroll-icon {
          font-size: 1.2rem;
          display: inline-block;
        }

        @keyframes subtle-bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
            opacity: 0.8;
          }
          50% {
            transform: translateX(-50%) translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen; 