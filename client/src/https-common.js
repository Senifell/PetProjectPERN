import axios from "axios";
import useAuthStore from "./store/authStore";

const https_public = axios.create({
  baseURL: "https://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
});

const https = axios.create({
  baseURL: "https://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

const setupInterceptors = () => {
  https.interceptors.request.use(
    (config) => {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  https.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { accessToken } = await useAuthStore
            .getState()
            .fetchAccessToken();
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          return https(originalRequest);
        } catch (refreshError) {
          console.log("refreshError: ", refreshError);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return https;
};

export { setupInterceptors, https, https_public };
