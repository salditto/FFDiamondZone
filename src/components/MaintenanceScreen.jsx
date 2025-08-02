'use client'

import { useTranslation } from 'react-i18next'

export default function MaintenanceScreen () {
  const { t } = useTranslation()

  return (
    <div className='maintenance-wrapper'>
      <div className='maintenance-container'>
        <div className='maintenance-content'>
          <div className='maintenance-icon'>
            <div className='gear-icon'>⚙️</div>
          </div>

          <h1 className='maintenance-title'>
            {t('maintenance.title', 'Sistema en Mantenimiento')}
          </h1>

          <p className='maintenance-description'>
            {t(
              'maintenance.description',
              'Estamos realizando mejoras en nuestro sistema. Volveremos pronto con nuevas funcionalidades.'
            )}
          </p>

          <div className='maintenance-features'>
            <div className='feature-item'>
              <span className='feature-icon'>🔧</span>
              <span>
                {t(
                  'maintenance.feature1',
                  'Mejorando la experiencia de usuario'
                )}
              </span>
            </div>
            <div className='feature-item'>
              <span className='feature-icon'>🚀</span>
              <span>
                {t('maintenance.feature2', 'Optimizando el rendimiento')}
              </span>
            </div>
            <div className='feature-item'>
              <span className='feature-icon'>🔒</span>
              <span>
                {t('maintenance.feature3', 'Reforzando la seguridad')}
              </span>
            </div>
          </div>

          <div className='maintenance-footer'>
            <p>{t('maintenance.footer', 'Gracias por tu paciencia')}</p>
            <div className='loading-dots'>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .maintenance-wrapper {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #0e0b1f 0%,
            #1a1535 50%,
            #2d1b69 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .maintenance-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(
              circle at 20% 80%,
              rgba(155, 77, 255, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(199, 125, 255, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 40% 40%,
              rgba(155, 77, 255, 0.05) 0%,
              transparent 50%
            );
          animation: backgroundPulse 4s ease-in-out infinite alternate;
        }

        @keyframes backgroundPulse {
          0% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        .maintenance-container {
          background: rgba(28, 21, 52, 0.9);
          border: 2px solid #9b4dff;
          border-radius: 1.5rem;
          padding: 3rem;
          max-width: 600px;
          width: 100%;
          text-align: center;
          box-shadow: 0 0 30px rgba(155, 77, 255, 0.3),
            inset 0 0 30px rgba(155, 77, 255, 0.1);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 1;
        }

        .maintenance-content {
          color: #fff;
        }

        .maintenance-icon {
          margin-bottom: 2rem;
        }

        .gear-icon {
          font-size: 4rem;
          animation: rotate 3s linear infinite;
          display: inline-block;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .maintenance-title {
          font-size: 2.5rem;
          color: #d4bfff;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 20px rgba(155, 77, 255, 0.5);
          font-weight: 700;
        }

        .maintenance-description {
          font-size: 1.2rem;
          color: #b8b8b8;
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .maintenance-features {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(155, 77, 255, 0.1);
          border: 1px solid rgba(155, 77, 255, 0.3);
          border-radius: 0.75rem;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: rgba(155, 77, 255, 0.2);
          transform: translateY(-2px);
        }

        .feature-icon {
          font-size: 1.5rem;
        }

        .maintenance-footer {
          border-top: 1px solid rgba(155, 77, 255, 0.3);
          padding-top: 2rem;
        }

        .maintenance-footer p {
          color: #9b4dff;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .loading-dots span {
          width: 12px;
          height: 12px;
          background: #9b4dff;
          border-radius: 50%;
          animation: loadingDots 1.4s ease-in-out infinite both;
        }

        .loading-dots span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .loading-dots span:nth-child(2) {
          animation-delay: -0.16s;
        }
        .loading-dots span:nth-child(3) {
          animation-delay: 0s;
        }

        @keyframes loadingDots {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .maintenance-wrapper {
            padding: 1rem;
          }

          .maintenance-container {
            padding: 2rem;
          }

          .maintenance-title {
            font-size: 2rem;
          }

          .maintenance-description {
            font-size: 1rem;
          }

          .feature-item {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}
