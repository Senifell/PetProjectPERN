import React, { useState, useEffect, useCallback } from "react";
import AccountDataService from "../services/account.service";
import { withRouter } from "../common/with-router";
import { useUser } from "../userContext";
import { useAuth } from "../authContext";
import ErrorComponent from "./error.component";
import Cropper from "./Cropper";
import { Modal, Box, Button } from "@mui/material";
import { toast } from "react-toastify";

import "./account.css";

function Account(props) {
  const { user } = useUser();
  const { logout } = useAuth();

  const [currentAccount, setCurrentAccount] = useState({
    id: null,
    id_user: user.id,
    name: "",
    surname: "",
    gender: "",
    description: "",
    steam_id: "",
    picture: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setCurrentAccount((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getAccount = useCallback((idUser) => {
    AccountDataService.get(idUser)
      .then((response) => {
        setCurrentAccount(response.data);
        console.log(response.data);
        setIsLoading(false);
        setError(null);
      })
      .catch((e) => {
        setError(e.message || "Что-то пошло не так");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getAccount(user.id);
  }, [user.id, getAccount]);

  const updateAccount = () => {
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("data", JSON.stringify(currentAccount));
    formData.append("idUser", user.id);

    AccountDataService.update(currentAccount.id_user, formData)
      .then(() => {
        toast(`Данные аккаунта успешно обновлены!`);
        getAccount(user.id);
      })
      .catch((e) => {
        setError(e.message || "Ошибка обновления данных аккаунта!");
      });
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    AccountDataService.deleteAccount(currentAccount.id_user)
      .then(() => {
        logout();
        localStorage.removeItem("loggedIn");
        props.router.navigate("/");
      })
      .catch((e) => {
        setError(e.message || "Ошибка удаления аккаунта!");
      });
  };

  const handleUpdateAvatar = (previewUrl, imageBlob) => {
    setSelectedFile(imageBlob);
    setCurrentAccount((prevState) => ({
      ...prevState,
      picture: previewUrl,
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  const boxStyle = {
    width: "600px",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    border: "5px solid #328daa",
    borderRadius: "10px",
    padding: "20px",
    boxSizing: "border-box",
  };

  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div className="account-container">
      <h2 className="h2 text-center my-4">Аккаунт</h2>
      <div className="account-card">
        <div className="account-left">
          <div className="mb-3 text-center">
            <Cropper
              img={currentAccount.picture}
              onUpdateAvatar={handleUpdateAvatar}
            />
          </div>
        </div>

        <div className="account-right">
          <form>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Name"
                name="name"
                value={currentAccount.name || ""}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="surname">Фамилия</label>
              <input
                type="text"
                className="form-control"
                id="surname"
                name="surname"
                value={currentAccount.surname || ""}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="steam_id">ID Steam</label>
              <input
                type="number"
                className="form-control"
                id="steam_id"
                placeholder="Steam ID"
                name="steam_id"
                value={currentAccount.steam_id || ""}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label>Пол</label>
              <div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="gender"
                    value="Female"
                    checked={currentAccount.gender === "Female"}
                    onChange={onChange}
                  />
                  <label className="form-check-label">Женский</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="gender"
                    value="Male"
                    checked={currentAccount.gender === "Male"}
                    onChange={onChange}
                  />
                  <label className="form-check-label">Мужской</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="gender"
                    value="Unknown"
                    checked={currentAccount.gender === "Unknown"}
                    onChange={onChange}
                  />
                  <label className="form-check-label">Не указано</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Дополнительная информация</label>
              <textarea
                className="form-control"
                id="description"
                placeholder="Дополнительная информация"
                name="description"
                value={currentAccount.description}
                onChange={onChange}
              />
            </div>
            <div className="buttons-container">
              <button
                type="button"
                className="btn btn-outline-danger mr-2"
                onClick={handleDeleteClick}
              >
                Удалить
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={updateAccount}
              >
                Обновить
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        sx={modalStyle}
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box sx={boxStyle}>
          <h3 className="h3 text-center">Подтвердите удаление</h3>
          <div>
            <div className="lead text-center m-1">
              <b>Вы уверены, что хотите удалить аккаунт?</b> <br /> Будут
              удалены все данные по аккаунту, в том числе список игр и
              коллекций. После подтверждения операцию невозможно отменить.
            </div>
          </div>

          <Box
            sx={{
              display: "flex",
              paddingTop: "20px",
            }}
          >
            <Button
              sx={{ background: "red", marginRight: "10px" }}
              size="medium"
              variant="contained"
              onClick={confirmDelete}
            >
              Удалить
            </Button>
            <Button
              size="medium"
              sx={{
                background: "grey",
              }}
              variant="contained"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Отмена
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default withRouter(Account);
