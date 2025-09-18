// STRIPE DISABLED: Stripe Elements and related code are commented out as per request.
'use client'
import React from 'react';
import store from "@/redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from '@react-oauth/google';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const Providers = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        {/* Stripe Elements removed */}
        {children}
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default Providers;