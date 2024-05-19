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
  return https.get(`/account/${id}`, { headers });
};

class AccountDataService {
  get(id, navigate) {
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

    return https.post("/account", data, { headers });
  }

  update(id, data) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.put(`/account/${id}`, data, { headers });
  }

  delete(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return https.delete(`/account/${id}`, { headers });
  }
}

const accountDataServiceInstance = new AccountDataService();

export default accountDataServiceInstance;
