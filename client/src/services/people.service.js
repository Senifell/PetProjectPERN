import https from "../https-common";

//meany

class PeopleDataService {
  getAll() {
    return https.get("/people");
  }

  get(id) {
    return https.get(`/people/${id}`);
  }

  create(data) {
    return https.post("/people", data);
  }

  update(id, data) {
    return https.put(`/people/${id}`, data);
  }

  delete(id) {
    return https.delete(`/people/${id}`);
  }

  deleteAll() {
    return https.delete(`/people`);
  }

  findByTitle(title) {
    return https.get(`/people?title=${title}`);
  }
}

const PeopleDataServiceInstance = new PeopleDataService();

export default PeopleDataServiceInstance;