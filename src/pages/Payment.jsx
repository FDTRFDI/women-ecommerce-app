import React, { useState } from "react";
import "./payment.css";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useNavigate, useLocation } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51T2GkQRV7UWVJc5vPmDUn7CJc07RVWn246msyB47JlMmvLcLPsL3e3Bb7qE62pnngNLCJQgDZIHjVWO83opI1Jzo00GForbZFg"
);

const API = "https://backend-women-ecommerce-2.onrender.com";

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [cardName, setCardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState("unknown");
  const [message, setMessage] = useState("");

  const handleCardChange = (event) => {
    if (event.brand) {
      setBrand(event.brand);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!cardName) {
      alert("Please enter card holder name");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${API}/api/payment/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Payment failed");
        setLoading(false);
        return;
      }

      const result = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: cardName,
            },
          },
        }
      );

      if (result.error) {
        setMessage(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        setMessage("✅ Payment Successful!");

        setTimeout(() => {
          navigate("/order-success");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server connection error");
    }

    setLoading(false);
  };

  const getCardLogo = () => {
    if (brand === "visa") return "💳 VISA";
    if (brand === "mastercard") return "💳 MasterCard";
    if (brand === "amex") return "💳 AMEX";
    return "💳 Card";
  };

  return (
    <div className="payment-container">
      <div className="payment-card">

        <div className="payment-left">
          <h2>Checkout Payment</h2>

          <div className="total-box">
            Total: <span>AED {total}</span>
          </div>

          <form onSubmit={handleSubmit} className="payment-form">

            <label>Card Holder Full Name</label>
            <input
              className="name-input"
              placeholder="Maged Elsayed"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />

            <label>Card Details {getCardLogo()}</label>

            <div className="card-input">
              <CardElement
                onChange={handleCardChange}
                options={{
                  hidePostalCode: true,
                }}
              />
            </div>

            <button disabled={!stripe || loading}>
              {loading ? "Processing..." : "Pay Now"}
            </button>

            {message && (
              <p className="payment-message">{message}</p>
            )}
          </form>
        </div>

        <div className="payment-right">
          <h3>Secure Payment</h3>
          <p>Your payment is encrypted and secured by Stripe.</p>

          <ul>
            <li>✔ SSL Protected</li>
            <li>✔ PCI Compliant</li>
            <li>✔ Instant Confirmation</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default function Payment() {
  const location = useLocation();
  const total = location.state?.total || 0;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm total={total} />
    </Elements>
  );
}
