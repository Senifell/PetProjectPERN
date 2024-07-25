import { useState, useCallback } from "react";
import PrivateGamesDataService from "../services/private-games.service";
import useAuthStore from "../store/authStore";

export function usePrivateGames(userId, currentPage, pageSize) {
  const [privateGames, setPrivateGames] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [errorPrivateGames, setErrorPrivateGames] = useState(null);

  const getPrivateGames = useCallback(() => {
    if (!userId) {
      useAuthStore
        .getState()
        .fetchAccessToken()
        .catch((error) => {
          setErrorPrivateGames(error.message || "Что-то пошло не так");
        });
    } else {
      PrivateGamesDataService.getAll(userId, currentPage, pageSize)
        .then((response) => {
          setPrivateGames(
            response.data || {
              items: [],
              totalItems: 0,
              totalPages: 0,
              currentPage: 1,
            }
          );
        })
        .catch((e) => {
          setErrorPrivateGames(e);
        });
    }
  }, [userId, currentPage, pageSize]);

  return { privateGames, errorPrivateGames, getPrivateGames };
}

export default usePrivateGames;
