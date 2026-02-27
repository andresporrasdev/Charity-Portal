import axios from "axios";
import BaseURL from "../config";

const axiosInstance = axios.create({ baseURL: BaseURL });

// Auto-inject token on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid token globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response.data?.message || "";
      if (
        msg.includes("Token expired") ||
        msg.includes("Invalid token") ||
        msg.includes("doesn't exist")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
