// src/store/authStore.js
import { create } from "zustand";
import axios from "axios";

const https = axios.create({
  baseURL: "https://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

const useAuthStore = create((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  fetchAccessToken: async () => {
    try {
      const response = await https.post("/user/auth/refresh", {});
      const newAccessToken = response.data.accessToken;
      const userData = {
        userId: response.data.user.userId,
        username: response.data.user.username,
        email: response.data.user.email,
      };
      set((state) => ({
        ...state,
        accessToken: newAccessToken,
        user: userData,
      }));

      return { accessToken: newAccessToken, userData: userData };
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },
}));

export default useAuthStore;
