import { https } from "../https-common";

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
}

const UserDataServiceInstance = new UserDataService();

export default UserDataServiceInstance;
