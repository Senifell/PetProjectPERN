// src/contexts/authContext.js
import React, { createContext, useContext, useEffect } from "react";
import useAuthStore from "./store/authStore";
import { setupInterceptors } from "./https-common";
import { useUser } from "./userContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { updateUser } = useUser();
  const { accessToken, setAccessToken, fetchAccessToken } = useAuthStore();

  const login = async (username, password) => {
    try {
      const axiosInstance = setupInterceptors(accessToken, fetchAccessToken);
      const response = await axiosInstance.post("/user/auth/login", {
        username,
        password,
      });

      if (response.status !== 200) {
        throw new Error("Authentication failed"); // Обработка ошибки
      }

      if (!response.data.accessToken) {
        throw new Error("Authentication failed"); //!!
      }

      setAccessToken(response.data.accessToken);

      const userDate = response.data.user;

      updateUser({
        id: userDate.userId,
        username: userDate.username,
        email: userDate.email,
      });
      return response;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const axiosInstance = setupInterceptors(accessToken, fetchAccessToken);
      const response = await axiosInstance.post("/user/auth/logout", {});

      if (response.status !== 204) {
        console.log(`RefreshToken don't delete!`);
      }

      setAccessToken(null);

      updateUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handlePageReload = async () => {
    try {
      const { userData } = await useAuthStore.getState().fetchAccessToken();
      updateUser({
        id: userData.userId,
        username: userData.username,
        email: userData.email,
      });
    } catch (error) {
      console.error("Error reloading user");
    }
  };

  useEffect(() => {
    handlePageReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, login, setAccessToken, logout, fetchAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
