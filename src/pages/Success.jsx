import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ استلام رقم الطلب من Checkout
  const orderId = location.state?.orderId;

  // ✅ منع دخول صفحة الدفع بدون طلب
  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  const [loading, setLoading] = useState(false);

  const [card, setCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setCard({
      ...card,
      [e.target.name]: e.target.value,
    });
  };

  /* =====================
       FAKE PAYMENT
  ===================== */
  const handlePayment = (e) => {
    e.preventDefault();

    setLoading(true);

    // محاكاة عملية الدفع
    setTimeout(() => {
      setLoading(false);

      // ✅ الانتقال لصفحة نجاح الطلب مع رقم الطلب
      navigate("/order-success", {
        state: { orderId },
      });
    }, 3000);
  };

  return (
    <div className="payment-container">
      <div className="payment-box">
        <h2>Payment Details</h2>

        {/* VISA CARD UI */}
        <div className="visa-card">
          <div className="visa-chip"></div>
          <h3>{card.number || "**** **** **** ****"}</h3>
          <p>{card.name || "CARD HOLDER"}</p>
          <span>{card.expiry || "MM/YY"}</span>
        </div>

        {/* FORM */}
        <form onSubmit={handlePayment}>
          <input
            type="text"
            name="name"
            placeholder="Card Holder Name"
            value={card.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="number"
            placeholder="Card Number"
            maxLength="16"
            value={card.number}
            onChange={handleChange}
            required
          />

          <div className="card-row">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={card.expiry}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="cvv"
              placeholder="CVV"
              maxLength="3"
              value={card.cvv}
              onChange={handleChange}
              required
            />
          </div>

          <button className="pay-btn" disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
