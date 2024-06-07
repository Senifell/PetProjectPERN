import https from "../https-common";

// Получение всех steam игр, обновление всех, обновление одной игры, просмотр подробной информации одной игры, удаление (?)
class SteamGamesDataService {
  // Получение всех игр (обновление если refresh: true)
  getAll(
    idUser,
    page = 1,
    pageSize = 50,
    search = "",
    isFree = "all",
    isLanguage = "all"
  ) {
    const token = localStorage.getItem("token");

    if (!token) {
      return Promise.reject(new Error("Token not found in localStorage."));
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = { page, pageSize, search, idUser, isFree, isLanguage };
    return https.get(`/steam-games/${idUser}`, { headers, params });
  }

  getOne(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      return Promise.reject(new Error("Token not found in localStorage."));
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.get(`/steam-games/get-app-info/${id}`, { headers });
  }

  update(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.put(`/steam-games/${id}`, { headers });
  }

  updateAll(idUser, setting = "list-games") {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = { setting, idUser };

    return https.put(`/steam-games/update`, { headers, params });
  }

  delete(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.delete(`/steam-games/${id}`, { headers });
  }
}

const steamGamesDataServiceInstance = new SteamGamesDataService();

export default steamGamesDataServiceInstance;
