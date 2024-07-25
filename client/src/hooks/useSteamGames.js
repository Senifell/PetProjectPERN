import { useState, useCallback } from "react";
import SteamGamesDataService from "../services/steam-games.service";
import useAuthStore from "../store/authStore";

export function useSteamGames(
  userId,
  currentPage,
  pageSize,
  searchGameByName,
  isFree,
  hasLanguage,
  sortBy
) {
  const [steamGames, setSteamGames] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [errorSteamGames, setErrorSteamGames] = useState(null);

  const getSteamGames = useCallback(() => {
    if (!userId) {
      useAuthStore
        .getState()
        .fetchAccessToken()
        .catch((error) => {
          setErrorSteamGames(error.message || "Что-то пошло не так");
        });
    } else {
      SteamGamesDataService.getAll(
        userId,
        currentPage,
        pageSize,
        searchGameByName,
        isFree,
        hasLanguage,
        sortBy
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
    }
  }, [
    userId,
    currentPage,
    pageSize,
    searchGameByName,
    isFree,
    hasLanguage,
    sortBy,
  ]);

  return { steamGames, errorSteamGames, getSteamGames };
}

export default useSteamGames;
