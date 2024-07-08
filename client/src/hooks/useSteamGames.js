import { useState, useCallback } from "react";
import SteamGamesDataService from "../services/steam-games.service";

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

  const [hasTrue, setHasTrue] = useState(false);

  const getSteamGames = useCallback(() => {
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
        setHasTrue(true);
      })
      .catch((e) => {
        if (hasTrue && e.response.status === 403) {
          setErrorSteamGames(e.message || "Что-то пошло не так");
        }
      });
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
