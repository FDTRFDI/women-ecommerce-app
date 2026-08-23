import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend-women-ecommerce.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة التوكن تلقائيًا مع أي Request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // دعم الحالة القديمة التي يكون فيها التوكن داخل user
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);

          if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch (error) {
          console.error(
            "Invalid user data in localStorage:",
            error
          );
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;