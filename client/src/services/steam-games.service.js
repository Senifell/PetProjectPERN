import { setupInterceptors } from "../https-common";

const axiosInstance = setupInterceptors();

const SteamGamesDataService = {
  getAll: (
    idUser,
    page = 1,
    pageSize = 50,
    search = "",
    isFree = "all",
    isLanguage = "all",
    sortBy
  ) => {
    const params = {
      page,
      pageSize,
      search,
      idUser,
      isFree,
      isLanguage,
      sortBy,
    };
    return axiosInstance.get(`/steam-games/${idUser}`, { params });
  },

  getOne: (id) => {
    return axiosInstance.get(`/steam-games/get-app-info/${id}`);
  },

  update: (id) => {
    return axiosInstance.put(`/steam-games/${id}`);
  },

  updateAll: (idUser, setting = "list-games") => {
    const params = { idUser, setting };
    return axiosInstance.put(`/steam-games/update`, { params });
  },

  deleteGame: (id) => {
    return axiosInstance.delete(`/steam-games/${id}`);
  },
};

export default SteamGamesDataService;
