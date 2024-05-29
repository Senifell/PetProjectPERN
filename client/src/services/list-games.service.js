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
  return https.get(`/list-games/${id}`, { headers });
};

class ListGamesDataService {
  getAll(id, navigate) {
    return fetchData(id, navigate);
  }

  getPublicListGames() {
    return https.get("/list-games");
  }

  create(data) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.post("/list-games", data, { headers });
  }

  update(id, data) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.put(`/list-games/${id}`, data, { headers });
  }

  delete(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.delete(`/list-games/${id}`, { headers });
  }
}

const listGamesDataServiceInstance = new ListGamesDataService();

export default listGamesDataServiceInstance;
