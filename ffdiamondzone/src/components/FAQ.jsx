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
      <h2 className="faq-title">Frequently Asked Questions</h2>
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
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 20px;
          background-color: rgba(10, 10, 20, 0.6);
          border-radius: 15px;
          border: 1px solid rgba(138, 43, 226, 0.2);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .faq-title {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 40px;
          color: var(--accent-color);
          font-weight: 700;
          text-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .faq-item {
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(138, 43, 226, 0.15);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
           border-color: rgba(138, 43, 226, 0.4);
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 18px 25px;
          background: none;
          border: none;
          text-align: left;
          font-size: 1.15rem;
          font-weight: 600;
          color: #eee;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .faq-question:hover {
          background-color: rgba(138, 43, 226, 0.1);
        }

        .faq-question.active {
          background-color: rgba(138, 43, 226, 0.15);
          color: var(--accent-color);
        }
        
        .faq-question span {
            flex: 1;
            padding-right: 15px;
        }

        .faq-question svg {
          transition: transform 0.3s ease;
          font-size: 1rem;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1), padding 0.5s ease;
          padding: 0 25px;
          background-color: rgba(0, 0, 0, 0.1);
        }

        .faq-answer.open {
          max-height: 300px; /* Adjust if answers are longer */
          padding: 20px 25px;
        }

        .faq-answer p {
          color: #ccc;
          font-size: 1rem;
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .faq-title {
            font-size: 2rem;
          }
          .faq-question {
            font-size: 1.05rem;
            padding: 15px 20px;
          }
          .faq-answer p {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQ; 