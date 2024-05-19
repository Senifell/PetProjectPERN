import https from "../https-common";

// Получение всех steam игр, обновление всех, обновление одной игры, просмотр подробной информации одной игры, удаление (?)
class SteamGamesDataService {
  // Получение всех игр (обновление если refresh: true)
  getAll(id, refresh = false, page = 1, pageSize = 50, search = "") {
    const token = localStorage.getItem("token");

    if (!token) {
      return Promise.reject(new Error("Token not found in localStorage."));
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const params = { refresh, page, pageSize, search };
    return https.get(`/steam-games/${id}`, { headers, params });
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
