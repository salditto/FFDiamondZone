import { useRef } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import About from './components/About'
import PurchaseForm from './components/PurchaseForm'
import Footer from './components/Footer'
import FAQ from './components/FAQ'
import Navbar from './components/Navbar'
import MaintenanceScreen from './components/MaintenanceScreen'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons'
import './App.css'
import { useAuth } from './context/AuthContext' // Import useAuth

function MainLayout () {
  const { t } = useTranslation()
  const formRef = useRef(null)
  const faqRef = useRef(null)
  const homeRef = useRef(null)
  const footerRef = useRef(null)
  const navigate = useNavigate()

  // Use states from AuthContext
  const { paymentsEnabled, isUserAdmin, loadingAuthContext } = useAuth()

  const handleScrollTo = ref => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleWhatsAppClick = () => {
    window.open(`https://chat.whatsapp.com/FNElv5DVQ7pFxLur47QuOM`, '_blank')
  }

  const handleInstagramClick = () => {
    // Replace with your actual Instagram profile URL
    window.open('https://instagram.com/ffdiamondzone', '_blank')
  }

  // Show loading while AuthContext is initializing
  if (loadingAuthContext) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #0e0b1f 0%, #1a1535 50%, #2d1b69 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #2b2145',
              borderTop: '3px solid #9b4dff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          ></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  // Display MaintenanceScreen if payments are disabled AND the user is not an admin
  if (!paymentsEnabled && !isUserAdmin) {
    return <MaintenanceScreen />
  }

  return (
    <div className='app'>
      <Navbar
        onFAQClick={() => handleScrollTo(faqRef)}
        onHomeClick={() => handleScrollTo(homeRef)}
        onBuyClick={() => handleScrollTo(formRef)}
        onContactClick={() => handleScrollTo(footerRef)}
        onLoginClick={() => navigate('/login')}
      />

      <div ref={homeRef} className='section hero-section-wrapper'>
        <WelcomeScreen
          onBuyClick={() => handleScrollTo(formRef)}
          onFAQClick={() => handleScrollTo(faqRef)}
          onScrollIndicatorClick={() =>
            document
              .getElementById('about-section')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        />
        <div className='section-divider'></div>
      </div>

      <div className='section about-section-wrapper'>
        <div id='about-section'>
          <About />
        </div>
      </div>

      <div ref={formRef} className='section form-section' id='buy-diamonds'>
        <h2 className='section-title'>{t('purchase_intro.title')}</h2>
        <p className='section-subtitle purchase-subtitle'>
          {t('purchase_intro.subtitle')}
        </p>
        <PurchaseForm />
      </div>

      <div ref={faqRef} className='section faq-section' id='faq'>
        <FAQ />
      </div>

      <div ref={footerRef} className='section footer-section'>
        <Footer />
      </div>

      {/* Floating Social Media Bubbles */}
      <div className='floating-social-bubbles'>
        <button
          className='social-bubble whatsapp-bubble'
          onClick={handleWhatsAppClick}
          aria-label={t('social.whatsapp_group', 'WhatsApp Group')}
          title={t('social.whatsapp_group', 'WhatsApp Group')}
        >
          <FontAwesomeIcon icon={faWhatsapp} className='icon' />
          <span className='text'>
            {t('social.whatsapp_group', 'WhatsApp Group')}
          </span>
        </button>
        <button
          className='social-bubble instagram-bubble'
          onClick={handleInstagramClick}
          aria-label={t('social.follow_instagram', 'Follow on Instagram')}
          title={t('social.follow_instagram', 'Follow on Instagram')}
        >
          <FontAwesomeIcon icon={faInstagram} className='icon' />
          <span className='text'>
            {t('social.follow_instagram', 'Follow on Instagram')}
          </span>
        </button>
      </div>
    </div>
  )
}

export default MainLayout
