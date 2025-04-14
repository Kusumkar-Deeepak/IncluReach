import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "https://inclureach-server.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
  timeout: 60000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Skip auth header for login/register requests
    const isAuthRequest = ["/auth/login", "/auth/register"].some((path) =>
      config.url.includes(path)
    );

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clean up auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Show error message
      toast.error("Session expired. Please login again.");

      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Handle other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
