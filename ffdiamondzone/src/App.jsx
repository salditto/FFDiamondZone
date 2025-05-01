import { useState, useRef } from 'react';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import About from './components/About';
// import MultiStepForm from './components/MultiStepForm'; // Comentar o eliminar
import PurchaseForm from './components/PurchaseForm'; // Importar el nuevo formulario
import Footer from './components/Footer';
import FAQ from './components/FAQ';
import Navbar from './components/Navbar';

function App() {
  const formRef = useRef(null);
  const faqRef = useRef(null);
  const homeRef = useRef(null);
  const footerRef = useRef(null);

  const handleScrollToFAQ = () => {
    faqRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToHome = () => {
    homeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Navbar 
        onFAQClick={handleScrollToFAQ} 
        onHomeClick={handleScrollToHome}
        onBuyClick={handleScrollToForm}
        onContactClick={handleScrollToFooter}
      />
      
      {/* Hero Section - Assumed to be full width from WelcomeScreen styles */}
      <div ref={homeRef} className="section hero-section-wrapper">
        <WelcomeScreen 
          onBuyClick={handleScrollToForm}
          onFAQClick={handleScrollToFAQ}
          onScrollIndicatorClick={handleScrollToAbout}
        />
        <div className="section-divider"></div>
      </div>
      
      {/* About Section - Allow full width */}
      <div className="section about-section-wrapper">
        <div id="about-section">
          <About />
        </div>
      </div>
      
      {/* Other sections might keep their container or need adjustment */}
      {/* Form Section */}
      <div ref={formRef} className="section form-section" id="buy-diamonds">
        <div className="form-section-container">
           <h2 className="section-title">Purchase Your Diamonds</h2>
           <PurchaseForm /> 
        </div>
      </div>
      
      {/* FAQ Section */}
      <div ref={faqRef} className="section faq-section" id="faq">
        <FAQ />
      </div>
      
      {/* Footer Section */}
      <div ref={footerRef} className="section footer-section">
        <Footer />
      </div>
    </div>
  );
}

export default App; 