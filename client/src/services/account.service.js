import setupInterceptors from "../https-common";
const axiosInstance = setupInterceptors();
const AccountDataService = {
  get: (idUser) => {
    const params = { idUser };
    return axiosInstance.get(`/account/${idUser}`, { params });
  },

  create: (data) => {
    return axiosInstance.post("/account", data);
  },

  update: (idUser, data) => {
    return axiosInstance.put(`/account/${idUser}`, data);
  },

  deleteAccount: (idUser) => {
    return axiosInstance.delete(`/account/${idUser}`);
  },
};

export default AccountDataService;
