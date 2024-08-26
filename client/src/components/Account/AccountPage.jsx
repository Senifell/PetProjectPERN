import React, { useState, useEffect, useCallback } from "react";
import AccountDataService from "../../services/account.service";
import { useUser } from "../../userContext";
import useAuthStore from "../../store/authStore";
import ErrorComponent from "../error.component";
import { successNotif, errorNotif } from "../../utils/notification";
import { AccountForm, ModalConfirmDelete, AccountImage } from "./index.js";
import styles from "./AccountPage.module.css";

function AccountPage() {
  const { user } = useUser();

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

  const getAccount = useCallback(async (idUser) => {
    if (!idUser) {
      try {
        await useAuthStore.getState().fetchAccessToken();
      } catch (error) {
        setError(error.message || "Что-то пошло не так");
        setIsLoading(false);
      }
    } else {
      try {
        const response = await AccountDataService.get(idUser);
        setCurrentAccount(response.data);
        setIsLoading(false);
        setError(null);
      } catch (e) {
        setError(e.message || "Что-то пошло не так");
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    getAccount(user.id);
  }, [user.id, getAccount]);

  const updateAccount = async () => {
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("data", JSON.stringify(currentAccount));
    formData.append("idUser", user.id);
  
    try {
      await AccountDataService.update(currentAccount.id_user, formData);
      successNotif('Данные аккаунта успешно обновлены!');
      getAccount(user.id);
    } catch (error) {
      errorNotif('Ошибка обновления данных аккаунта!');
    }
  };

  const handleUpdateImage = (previewUrl, imageBlob) => {
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

  return (
    <div className={styles.accountContainer}>
      <h2 className="h2 text-center my-4">Аккаунт</h2>
      <div className={styles.accountCard}>
        <div className={styles.accountLeft}>
          <div className="mb-3 text-center">
            <AccountImage
              img={currentAccount.picture}
              onUpdateImage={handleUpdateImage}
            />
          </div>
        </div>

        <div className={styles.accountRight}>
          <form>
            <AccountForm currentAccount={currentAccount} onChange={onChange} />
          </form>
          <div className="buttons-container">
            <button
              type="button"
              className="btn btn-outline-danger mr-2"
              onClick={() => setIsDeleteModalOpen(true)}
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
        </div>
      </div>
      <ModalConfirmDelete
        idUser={currentAccount.id_user}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
    </div>
  );
}

export default AccountPage;