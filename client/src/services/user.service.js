import https from "../https-common";

class UserDataService {
  getAll() {
    return https.get("/user");
  }

  get(id) {
    return https.get(`/user/${id}`);
  }

  create(data) {
    return https.post("/user", data);
  }

  update(id, data) {
    return https.put(`/user/${id}`, data);
  }

  delete(id) {
    return https.delete(`/user/${id}`);
  }

  deleteAll() {
    return https.delete(`/user`);
  }

  signInUser(username, password) {
    return https.post('/user/login', { username, password });
  }
}

const UserDataServiceInstance = new UserDataService();

export default UserDataServiceInstance;