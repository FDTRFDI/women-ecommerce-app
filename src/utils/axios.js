import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend-women-ecommerce.onrender.com/api",
});

instance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const user = JSON.parse(storedUser);

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }

  return config;
});

export default instance;