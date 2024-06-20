import setupInterceptors from "../https-common";

const axiosInstance = setupInterceptors();

const PrivateGamesDataService = {
  getAll: (idUser) => {
    const params = { idUser };
    return axiosInstance.get(`/private-games/${idUser}`, { params });
  },

  getSteamGames: (id) => {
    return axiosInstance.get(`/private-games/${id}/steam-game`);
  },

  create: (data) => {
    return axiosInstance.post(`/private-games`, data);
  },

  update: (id, data) => {
    return axiosInstance.put(`/private-games/${id}`, data);
  },

  deleteGame: (id) => {
    return axiosInstance.delete(`/private-games/${id}`);
  },
};

export default PrivateGamesDataService;
