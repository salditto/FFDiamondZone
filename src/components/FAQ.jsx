import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Definimos cuántos items de FAQ tenemos (basado en las claves q0-q5, a0-a5)
const FAQ_ITEM_COUNT = 6;

const FAQ = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="section-title">{t('faq.title')}</h2>
      <div className="faq-list">
        {[...Array(FAQ_ITEM_COUNT)].map((_, index) => (
          <div key={index} className="faq-item">
            <button 
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <span>{t(`faq.q${index}`)}</span>
              <FontAwesomeIcon icon={activeIndex === index ? faChevronUp : faChevronDown} />
            </button>
            <div className={`faq-answer ${activeIndex === index ? 'open' : ''}`}>
              <p>{t(`faq.a${index}`)}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .faq-container {
          max-width: 1240px;
          width: 100%;
          margin: 40px auto;
          padding: 0 20px;
          background-color: transparent;
          border-radius: 0;
          border: none;
          backdrop-filter: none;
          box-shadow: none;
          position: relative;
          z-index: 1;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .faq-item {
          background-color: transparent;
          border-radius: 8px;
          border: 1px solid var(--border-color-light);
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 10px;
        }

        .faq-item:hover {
           border-color: var(--accent-color);
           background-color: rgba(138, 43, 226, 0.05);
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 20px 25px;
          background: transparent;
          border: none;
          text-align: left;
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--text-color);
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .faq-question:hover {
          color: var(--accent-color-2);
        }

        .faq-question.active {
          background-color: rgba(138, 43, 226, 0.1);
          color: #fff;
          font-weight: var(--font-weight-bold);
        }
        
        .faq-question span {
            flex: 1;
            padding-right: 15px;
        }

        .faq-question svg {
          transition: transform 0.3s ease;
          font-size: var(--font-size-md);
          color: var(--accent-color);
        }
        
        .faq-question.active svg {
             color: #fff;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-out, padding 0.4s ease-out;
          padding: 0 25px;
          background-color: rgba(0, 0, 0, 0.2);
          border-top: 1px solid var(--border-color-light);
        }

        .faq-answer.open {
          max-height: 350px;
          padding: 25px 25px;
        }

        .faq-answer p {
          color: var(--subtext-color);
          font-size: var(--font-size-md);
          line-height: var(--line-height-loose);
          margin: 0;
        }

        @media (max-width: 768px) {
          .faq-question {
            font-size: var(--font-size-md);
            padding: 18px 20px;
          }
          .faq-answer p {
            font-size: var(--font-size-sm);
             line-height: var(--line-height-base);
          }
           .faq-answer.open {
              padding: 20px 20px;
           }
        }
      `}</style>
    </div>
  );
};

export default FAQ; 