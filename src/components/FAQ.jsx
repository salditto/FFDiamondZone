import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const faqData = [
  {
    question: "How long does it take to receive the diamonds?",
    answer: "Diamond delivery is usually instant or takes just a few minutes after payment confirmation. Delays are rare but can occur due to high traffic or technical issues."
  },
  {
    question: "Is my account information safe?",
    answer: "Absolutely. We only require your Player ID to top up diamonds. We never ask for your password or login details. Our payment process is also secured."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods including MercadoPago, Bank Transfer (ARS), Wise, and Cryptocurrencies (like Bitcoin and Ethereum). More options may be added in the future."
  },
  {
    question: "What if I enter the wrong Player ID?",
    answer: "Please double-check your Player ID before confirming the purchase. Diamonds sent to an incorrect ID due to user error cannot be refunded or transferred. Ensure the ID is correct."
  },
  {
    question: "Can I get a refund?",
    answer: "Due to the nature of digital goods, all sales are final once the diamonds have been delivered. Refunds are only possible in specific cases where delivery fails due to our system error."
  },
  {
    question: "Are you affiliated with Garena Free Fire?",
    answer: "No, FF Diamond Zone is an independent third-party service. We are not affiliated, endorsed, or sponsored by Garena or Free Fire."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="section-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <button 
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <span>{item.question}</span>
              <FontAwesomeIcon icon={activeIndex === index ? faChevronUp : faChevronDown} />
            </button>
            <div className={`faq-answer ${activeIndex === index ? 'open' : ''}`}>
              <p>{item.answer}</p>
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