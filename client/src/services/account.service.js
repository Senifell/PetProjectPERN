import { setupInterceptors } from "../https-common";

const axiosInstance = setupInterceptors();
const AccountDataService = {
  get: (idUser) => {
    const params = { idUser };
    return axiosInstance.get(`/account`, { params });
  },

  // create: (data) => {
  //   return axiosInstance.post("/account", data);
  // },

  update: (idUser, formData) => {
    return axiosInstance.post(`/account/${idUser}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  },

  deleteAccount: (idUser) => {
    const params = { idUser };
    return axiosInstance.delete(`/account/${idUser}`, { params });
  },
};

export default AccountDataService;
