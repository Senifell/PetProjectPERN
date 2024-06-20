import setupInterceptors from "../https-common";

const axiosInstance = setupInterceptors();

const ListGamesDataService = {
  getAll: (idUser) => {
    const params = { idUser };
    return axiosInstance.get(`/list-games/${idUser}`, { params });
  },

  getPublicListGames: () => {
    return axiosInstance.get("/list-games");
  },

  create: (data) => {
    return axiosInstance.post("/list-games", data);
  },

  update: (id, data) => {
    return axiosInstance.put(`/list-games/${id}`, data);
  },

  deleteListGame: (id) => {
    return axiosInstance.delete(`/list-games/${id}`);
  },
};

export default ListGamesDataService;
