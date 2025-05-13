// StripeElementsWrapper.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe }            from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const EmbeddedCheckout = ({ packageId, amount, currency }) => {
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    // Llamar a tu API para crear el intent
    fetch('/api/payments/stripe/intent', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ packageId, amount, currency })
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, [packageId, amount, currency]);

  if (!clientSecret) return <div>Cargando pago…</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

const CheckoutForm = () => {
  const stripe   = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/success'
      },
      redirect: 'if_required'
    });

    if (error) {
      setMessage(error.message || 'An unknown error occurred.');
    } else if (paymentIntent?.status === 'succeeded') {
      setMessage('Pago exitoso 🎉');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>Pagar</button>
      {message && <div>{message}</div>}
    </form>
  );
};
