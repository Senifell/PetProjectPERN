import https from "../https-common";

const fetchData = async (id, navigate) => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate('/');  // Перенаправление на страницу входа
    return Promise.reject(new Error("Token not found in localStorage."));
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Выполнение GET-запроса с токеном
  return https.get(`/private-games/${id}`, { headers });
};

class PrivateGamesDataService {
  getAll(id, navigate) {
    return fetchData(id, navigate);
  }

  create(data) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.post("/private-games", data, { headers });
  }

  update(id, data) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.put(`/private-games/${id}`, data, { headers });
  }

  delete(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.delete(`/private-games/${id}`, { headers });
  }

  getSteamGames(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.get(`/private-games/${id}/steam-game`, { headers });
  }
}

const privateGamesDataServiceInstance = new PrivateGamesDataService();

export default privateGamesDataServiceInstance;
