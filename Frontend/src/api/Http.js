import axios from "axios";
import { STORAGE_KEYS } from "../utils/storageKeys.js";

const baseURL = "http://localhost:3000";

const Http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
Http.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
      const auth = raw ? JSON.parse(raw) : null;

      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch (error) {
      console.error("Failed to parse auth data:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid token
Http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default Http;