import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faShoppingCart, faQuestionCircle, faEnvelope, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onFAQClick, onHomeClick, onContactClick, onBuyClick, onAboutClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      console.log("Scroll event detected on document!");
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const shouldBeScrolled = scrollTop > 30;
      console.log('ScrollTop:', scrollTop, 'Should be scrolled:', shouldBeScrolled);
      setScrolled(prevState => {
        if (prevState !== shouldBeScrolled) {
            return shouldBeScrolled;
        }
        return prevState;
      });
    };
    
    console.log("Adding scroll listener to document...");
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
        console.log("Removing scroll listener from document...");
        document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (scrollFunction) => {
    if (scrollFunction) {
      scrollFunction();
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', icon: faHome, handler: onHomeClick, href: '#' },
    { label: 'About', icon: faInfoCircle, handler: onAboutClick, href: '#about-section' },
    { label: 'Buy Diamonds', icon: faShoppingCart, handler: onBuyClick, href: '#buy-diamonds' },
    { label: 'FAQ', icon: faQuestionCircle, handler: onFAQClick, href: '#faq' },
    { label: 'Contact', icon: faEnvelope, handler: onContactClick, href: '#contact' },
  ];

  console.log('Navbar render - Scrolled state:', scrolled);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="navbar-bg-effects"></div>
      
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => handleLinkClick(onHomeClick)}>
          <img src="/ffdiamond-logo.svg" alt="FF Diamond Zone Logo" className="logo-svg" />
        </div>
        
        <div className="navbar-links desktop-links">
           {navLinks.map(link => (
             <a 
               key={link.label}
               href={link.href}
               onClick={(e) => {
                 e.preventDefault();
                 handleLinkClick(link.handler);
               }}
               className="nav-link"
             >
               <FontAwesomeIcon icon={link.icon} className="nav-icon" />
               {link.label}
             </a>
           ))}
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
         {navLinks.map(link => (
             <a 
               key={link.label}
               href={link.href}
               onClick={(e) => {
                 e.preventDefault();
                 handleLinkClick(link.handler);
               }}
               className="mobile-nav-link"
             >
               <FontAwesomeIcon icon={link.icon} className="nav-icon" />
               {link.label}
             </a>
           ))}
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: background-color 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease;
          padding: 15px 0;
          background: transparent;
          border-bottom: 1px solid transparent;
        }
        
        .navbar.scrolled {
          padding: 10px 0;
          background-color: #000000;
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color-accent);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .navbar-bg-effects {
           position: absolute;
           top: 0; left: 0; width: 100%; height: 100%;
           background: linear-gradient(to right, rgba(138, 43, 226, 0.02), transparent, rgba(0, 200, 255, 0.02));
           opacity: 0;
           transition: opacity 0.4s ease;
           pointer-events: none;
           z-index: -1;
        }
        
        .navbar.scrolled .navbar-bg-effects {
            opacity: 0.5;
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 30px;
        }

        .navbar-logo {
          cursor: pointer;
          height: 45px;
          transition: transform 0.3s ease;
        }
        .navbar-logo:hover {
           transform: scale(1.05);
        }
        
        .logo-svg {
           height: 100%;
           width: auto;
           filter: drop-shadow(0 0 8px rgba(138, 43, 226, 0.5));
        }

        .navbar-links {
          display: flex;
          gap: 25px;
        }

        .nav-link {
          color: #e0e0e0;
          text-decoration: none;
          font-size: 1.4rem;
          font-weight: 500;
          padding: 10px 15px;
          border-radius: 6px;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid transparent;
        }
        
        .nav-icon {
           font-size: 1.2em;
        }

        .nav-link:hover {
          color: #fff;
          background-color: rgba(138, 43, 226, 0.2);
          border-color: rgba(138, 43, 226, 0.4);
          transform: translateY(-2px);
          text-shadow: 0 0 5px rgba(138, 43, 226, 0.7);
        }
        
        .nav-link.active {
           color: var(--accent-color);
           font-weight: 600;
        }

        .mobile-menu-toggle {
          display: none;
          font-size: 1.8rem;
          color: #fff;
          cursor: pointer;
          z-index: 1001;
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          position: fixed;
          top: 0;
          right: -100%;
          width: 280px;
          height: 100vh;
          background: #0a051a;
          padding: 80px 20px 20px;
          box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
          transition: right 0.4s ease-in-out;
          z-index: 1000;
        }
        
        .mobile-menu.open {
            right: 0;
        }
        
        .mobile-nav-link {
           color: #e0e0e0;
           text-decoration: none;
           font-size: 1.6rem;
           padding: 18px 15px;
           display: flex;
           align-items: center;
           gap: 12px;
           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
           transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        .mobile-nav-link:hover {
           background-color: rgba(138, 43, 226, 0.15);
           color: #fff;
        }

        @media (max-width: 992px) {
          .desktop-links {
            display: none;
          }
          .mobile-menu-toggle {
            display: block;
          }
           .mobile-menu {
             display: flex;
           }
        }
        
        @media (max-width: 480px) {
           .navbar-container {
              padding: 0 15px;
           }
           .navbar-logo {
               height: 35px;
           }
           .mobile-menu {
                width: 220px;
           }
           .mobile-nav-link {
               font-size: var(--font-size-md);
               padding: 15px;
           }
           .mobile-menu-toggle {
              font-size: var(--font-size-lg);
           }
        }

      `}</style>
    </nav>
  );
};

export default Navbar; 