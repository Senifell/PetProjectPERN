import { useState, useCallback } from "react";
import SteamGamesDataService from "../services/steam-games.service";

export function useSteamGames(
  userId,
  currentPage,
  pageSize,
  searchGameByName,
  isFree,
  hasLanguage
) {
  const [steamGames, setSteamGames] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [errorSteamGames, setErrorSteamGames] = useState(null);

  const getSteamGames = useCallback(() => {
    SteamGamesDataService.getAll(
      userId,
      currentPage,
      pageSize,
      searchGameByName,
      isFree,
      hasLanguage
    )
      .then((response) => {
        setSteamGames(
          response.data || {
            items: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
          }
        );
      })
      .catch((e) => {
        setErrorSteamGames(e.message || "Что-то пошло не так");
      });
  }, [userId, currentPage, pageSize, searchGameByName, isFree, hasLanguage]);

  return { steamGames, errorSteamGames, getSteamGames };
}

export default useSteamGames;
