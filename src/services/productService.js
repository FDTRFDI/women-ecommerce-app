const API_URL = "https://backend-women-ecommerce-2.onrender.com/api/products";

export const getProducts = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
