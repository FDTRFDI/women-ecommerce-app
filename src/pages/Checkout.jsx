import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./checkout.css";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((total, item) => {
    return total + Number(item.price || 0) * (item.quantity || 1);
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return "Enter full name";
    if (!formData.phone.trim()) return "Enter phone number";
    if (!formData.address.trim()) return "Enter address";
    if (!formData.city.trim()) return "Enter city";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      alert("Please login first");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: cart,
          total_price: totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // Save last order
      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          id: data.order.id,
          total: totalPrice,
          date: new Date().toLocaleString(),
        })
      );

      // 🔥 أهم خطوة: تصفير السلة بعد نجاح الطلب
      clearCart();

      // Go to payment page with total
      navigate("/payment", { state: { total: totalPrice } });

    } catch (error) {
      console.error(error);
      alert("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h2>Customer Information</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />

          <div className="checkout-summary">
            Total: <strong>{totalPrice} AED</strong>
          </div>

          <button
            type="submit"
            className="checkout-btn"
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;