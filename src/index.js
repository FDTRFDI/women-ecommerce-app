import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { CartProvider } from "./context/CartContext";

// ✅ Stripe key
const stripePromise = loadStripe(
  "pk_test_51T2GleRiy2ue2W6LMxXZ1NfE9T45fV8umPg5LLUPyzmV2Z61fQa6t3URDmB8FtV1RMBljx1Bhyyei771es9BYdsw00ySRndmq1"
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);


