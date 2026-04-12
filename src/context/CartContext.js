import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const API = "http://localhost:5000/api";

  const [cart, setCart] = useState([]);

  /*
  =====================
  GET CART (per user)
  =====================
  */
  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (!token) {
        setCart([]);
        return;
      }

      const res = await fetch(`${API}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setCart([]);
        return;
      }

      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch cart error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /*
  =====================
  ADD TO CART
  =====================
  */
  const addToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      alert("Please login first");
      return;
    }

    const productId = Number(
      product.product_id || product.id || product._id
    );

    if (!productId) return;

    // Optimistic update
    setCart((prev) => {
      const exist = prev.find(
        (item) => Number(item.product_id) === productId
      );

      if (exist) {
        return prev.map((item) =>
          Number(item.product_id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: Date.now(),
          product_id: productId,
          name: product.title || product.name,
          price: product.price,
          image: product.image || product.main_image,
          quantity: 1,
        },
      ];
    });

    try {
      await fetch(`${API}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      });
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  /*
  =====================
  CLEAR CART (per user)
  =====================
  */
  const clearCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (!token) return;

      await fetch(`${API}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart([]); // ← تصفير السلة محليًا
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  /*
  =====================
  TOTAL QUANTITY
  =====================
  */
  const totalQuantity = cart.reduce(
    (t, item) => t + Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        clearCart,
        totalQuantity,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};