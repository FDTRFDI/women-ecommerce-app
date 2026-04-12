// components/cart/AddToCartButton.jsx
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <button onClick={() => addToCart(product)}>
      إضافة للسلة
    </button>
  );
}
