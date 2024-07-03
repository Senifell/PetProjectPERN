import { useState, useCallback } from "react";
import PrivateGamesDataService from "../services/private-games.service";

export function usePrivateGames(userId, currentPage, pageSize) {
  const [privateGames, setPrivateGames] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [errorPrivateGames, setErrorPrivateGames] = useState(null);

  const getPrivateGames = useCallback(() => {
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
  }, [userId, currentPage, pageSize]);

  return { privateGames, errorPrivateGames, getPrivateGames };
}

export default usePrivateGames;
