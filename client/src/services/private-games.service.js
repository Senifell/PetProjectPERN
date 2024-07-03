import { setupInterceptors } from "../https-common";

const axiosInstance = setupInterceptors();

const PrivateGamesDataService = {
  getAll: (idUser, page = 1, pageSize = 50) => {
    const params = { idUser, page, pageSize };
    return axiosInstance.get(`/private-games/${idUser}`, { params });
  },

  getSteamGames: (idUser) => {
    const params = { idUser };
    return axiosInstance.get(`/private-games/${idUser}/get-steam-game`, {
      params,
    });
  },

  create: (idUser, data) => {
    const params = { idUser };
    return axiosInstance.post(`/private-games`, data, { params });
  },

  update: (idUser, id, data) => {
    const params = { idUser };
    return axiosInstance.put(`/private-games/${id}`, data, { params });
  },

  deleteGame: (idUser, id) => {
    const params = { idUser };
    return axiosInstance.delete(`/private-games/${id}`, { params });
  },
};

export default PrivateGamesDataService;
