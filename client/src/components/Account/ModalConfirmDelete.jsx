import React from "react";
import AccountDataService from "../../services/account.service";
import { useAuth } from "../../authContext";
import { Modal, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { successNotif, errorNotif } from "../../utils/notification";

import styles from "./ModalConfirmDelete.module.css";

function ModalConfirmDelete({
  idUser,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const confirmDelete = async () => {
    try {
      await AccountDataService.deleteAccount(idUser);

      logout();
      setIsDeleteModalOpen(false);
      successNotif("Аккаунт успешно удален.");
      navigate("/");
    } catch (error) {
      errorNotif("Ошибка удаления аккаунта!");
    }
  };

  return (
    <>
      <Modal
        className={styles.modalStyle}
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        closeAfterTransition
      >
        <Box className={styles.modalBox}>
          <h3 className="h3 text-center">Подтвердите удаление</h3>
          <div>
            <div className="lead text-center m-1">
              <b>Вы уверены, что хотите удалить аккаунт?</b> <br /> Будут
              удалены все данные по аккаунту, в том числе список игр и
              коллекций. После подтверждения операцию невозможно отменить.
            </div>
          </div>

          <Box>
            <Button
              className={styles.buttonDelete}
              size="medium"
              variant="contained"
              onClick={confirmDelete}
            >
              Удалить
            </Button>
            <Button
              className={styles.buttonCancel}
              size="medium"
              variant="contained"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Отмена
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default ModalConfirmDelete;
