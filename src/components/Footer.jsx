import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <div className="footer-section about">
          <div className="footer-logo">
            <img src="/ffdiamond-logo.svg" alt="FF Diamond Zone Logo" className="footer-logo-svg" />
          </div>
          <p className="footer-description">
            The premier destination for Free Fire diamonds. Fast, secure, and reliable service for gamers.
          </p>
          <div className="social-links">
            <a href="#" className="social-link"><i className="social-icon">📱</i></a>
            <a href="#" className="social-link"><i className="social-icon">🐦</i></a>
            <a href="#" className="social-link"><i className="social-icon">📸</i></a>
            <a href="#" className="social-link"><i className="social-icon">💬</i></a>
          </div>
        </div>
        
        <div className="footer-section links">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#buy-diamonds">Buy Diamonds</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#">Terms &amp; Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="contact-info">
            <li><span className="contact-icon">✉️</span> support@ffdiamondzone.com</li>
            <li><span className="contact-icon">🕓</span> 24/7 Customer Support</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FF Diamond Zone. All rights reserved.</p>
        <p className="disclaimer">FF Diamond Zone is not affiliated with Garena or Free Fire. All game-related assets belong to their respective owners.</p>
      </div>
      
      <style jsx>{`
        .footer {
          background-color: rgba(10, 10, 15, 0.95);
          padding: 70px 0 30px;
          border-top: 1px solid rgba(138, 43, 226, 0.3);
          position: relative;
          z-index: 1;
        }
        
        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(138, 43, 226, 0.05), rgba(218, 112, 214, 0.05));
          z-index: -1;
          pointer-events: none;
        }
        
        .footer-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .footer-section {
          flex: 1;
          margin-right: 30px;
          margin-bottom: 40px;
          min-width: 250px;
        }
        
        .footer-section:last-child {
          margin-right: 0;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .footer-logo-svg {
          height: 40px;
          width: auto;
          filter: drop-shadow(0 0 8px rgba(138, 43, 226, 0.4));
        }
        
        .footer-description {
          color: #ccc;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        
        .social-links {
          display: flex;
          gap: 15px;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(138, 43, 226, 0.1);
          border: 1px solid rgba(138, 43, 226, 0.3);
          transition: all 0.3s;
        }
        
        .social-link:hover {
          background-color: rgba(138, 43, 226, 0.2);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .footer-heading {
          color: white;
          font-size: 1.2rem;
          margin-bottom: 20px;
          font-weight: 600;
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
          margin-bottom: 10px;
        }
        
        .footer-links a {
          color: #ccc;
          text-decoration: none;
          transition: all 0.3s;
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
          color: #ccc;
        }
        
        .contact-icon {
          margin-right: 10px;
          font-size: 1.2rem;
        }
        
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 30px;
          color: #aaa;
          font-size: 0.9rem;
        }
        
        .disclaimer {
          margin-top: 10px;
          font-size: 0.8rem;
          color: #888;
        }
        
        @media (max-width: 992px) {
          .footer-section {
            flex: 1 1 calc(50% - 30px);
          }
        }
        
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
          }
          
          .footer-section {
            margin-right: 0;
            margin-bottom: 40px;
          }
          
          .footer-section:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer; 