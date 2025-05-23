import { useRef } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import About from './components/About';
import PurchaseForm from './components/PurchaseForm';
import Footer from './components/Footer';
import FAQ from './components/FAQ';
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';

function MainLayout() {
  const formRef = useRef(null);
  const faqRef = useRef(null);
  const homeRef = useRef(null);
  const footerRef = useRef(null);
  const navigate = useNavigate();

  const handleScrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Navbar 
        onFAQClick={() => handleScrollTo(faqRef)} 
        onHomeClick={() => handleScrollTo(homeRef)}
        onBuyClick={() => handleScrollTo(formRef)}
        onContactClick={() => handleScrollTo(footerRef)}
        onLoginClick={() => navigate("/login")}
      />

      <div ref={homeRef} className="section hero-section-wrapper">
        <WelcomeScreen 
          onBuyClick={() => handleScrollTo(formRef)}
          onFAQClick={() => handleScrollTo(faqRef)}
          onScrollIndicatorClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <div className="section-divider"></div>
      </div>

      <div className="section about-section-wrapper">
        <div id="about-section">
          <About />
        </div>
      </div>

      <div ref={formRef} className="section form-section" id="buy-diamonds">
        <h2 className="section-title">Purchase Your Diamonds</h2>
        <p className="section-subtitle purchase-subtitle">
          Complete the steps below to get your diamonds instantly and securely.
        </p>
        <PurchaseForm /> 
      </div>

      <div ref={faqRef} className="section faq-section" id="faq">
        <FAQ />
      </div>

      <div ref={footerRef} className="section footer-section">
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
