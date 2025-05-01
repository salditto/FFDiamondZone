import React, { useState, useEffect } from 'react';

const Navbar = ({ onFAQClick, onHomeClick, onContactClick, onBuyClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={onHomeClick}>
          <span className="logo-icon">💎</span>
          <span className="logo-text">FF Diamond Zone</span>
        </div>
        <div className="navbar-links">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onHomeClick && onHomeClick();
            }} 
            className="nav-link active"
          >
            Home
          </a>
          <a 
            href="#buy-diamonds" 
            onClick={(e) => {
              e.preventDefault();
              onBuyClick && onBuyClick();
            }} 
            className="nav-link"
          >
            Comprar Diamantes
          </a>
          <a 
            href="#faq" 
            onClick={(e) => {
              e.preventDefault();
              onFAQClick && onFAQClick();
            }} 
            className="nav-link"
          >
            FAQ
          </a>
          <a 
            href="#contact" 
            onClick={(e) => {
              e.preventDefault();
              onContactClick && onContactClick();
            }} 
            className="nav-link"
          >
            Contact
          </a>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          transition: all 0.4s ease;
          padding: 15px 0;
          background: rgba(10, 10, 15, 0.4);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 200, 255, 0.2);
        }

        .navbar.scrolled {
          padding: 10px 0;
          background: rgba(10, 10, 15, 0.9);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
          border-bottom: 1px solid var(--accent-color);
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .logo-icon {
          font-size: 1.8rem;
          margin-right: 10px;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(to right, var(--accent-color), var(--accent-color-2));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
        }

        .navbar-links {
          display: flex;
          gap: 20px;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 500;
          padding: 8px 15px;
          border-radius: 4px;
          transition: all 0.3s;
          position: relative;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--accent-color);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(to right, var(--accent-color), var(--accent-color-2));
          transition: all 0.3s;
          transform: translateX(-50%);
        }

        .nav-link:hover::after, .nav-link.active::after {
          width: 80%;
        }

        @media (max-width: 768px) {
          .navbar-links {
            gap: 10px;
          }

          .nav-link {
            font-size: 0.9rem;
            padding: 6px 10px;
          }

          .logo-text {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 576px) {
          .navbar-links {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 