import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./cart.css";

const Cart = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-wrapper">
        {/* LEFT SIDE */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => {
              // 🔥 هنا بالظبط — أهم خطوة
              console.log("IMAGE IN CART:", item.image);

              return (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />

                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Price: {item.price} UAE</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>

                  <div className="item-total">
                    {item.price * item.quantity} UAE
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <p>Total: {totalPrice} UAE</p>

          <button
            className="checkout-btn"
            onClick={() =>
              navigate("/checkout", {
                state: {
                  cart: cart,
                  totalPrice: totalPrice,
                },
              })
            }
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;