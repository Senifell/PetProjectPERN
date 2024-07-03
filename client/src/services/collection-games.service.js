import { https_public, setupInterceptors } from "../https-common";

const axiosInstance = setupInterceptors();

const CollectionGamesData = {
  getAll: (idListGames, idUser) => {
    const params = { idUser: idUser };
    return axiosInstance.get(`/collection-games/${idListGames}`, { params });
  },

  getAllPublic: (idListGames) => {
    return https_public.get(`/collection-games/public/${idListGames}`);
  },

  addGamesToCollection: (idListGames, idUser, data) => {
    const params = { idUser: idUser };
    return axiosInstance.post(`/collection-games/${idListGames}`, data, {
      params,
    });
  },

  deleteGamesFromCollection: (idListGames, idUser, data) => {
    const params = { data: data, idUser: idUser };
    return axiosInstance.delete(`/collection-games/${idListGames}`, {
      params,
    });
  },
};

export default CollectionGamesData;
