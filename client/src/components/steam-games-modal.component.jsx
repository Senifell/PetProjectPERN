import React from "react";
import {
  Modal,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
} from "react-bootstrap";

const SteamGameModal = ({
  showModal,
  setShowModal,
  steamGame,
  handleUpdateData,
}) => {
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
    <Modal
      className={modalStyle}
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Об игре: {steamGame.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px" }}>
        <div>
          <span>
            <b>Название:</b> {steamGame.name}
          </span>
        </div>
        <div>
          <span>
            <b>Статус:</b> {!steamGame.is_free ? "Платная" : "Бесплатная"}
          </span>
        </div>
        <div>
          <span>
            <b>Поддерживаемые языки:</b> {steamGame.supported_languages}
          </span>
        </div>
        <div>
          <span>
            <b>Жанры:</b> {steamGame.genres}
          </span>
        </div>
        <div>
          <span>
            <b>Категории:</b> {steamGame.categories}
          </span>
        </div>
        <div>
          <span>
            <b>Краткое описание:</b> {steamGame.short_description}
          </span>
        </div>
        <div>
          <span>
            <b>Дата релиза:</b> {steamGame.release_date}
          </span>
        </div>
        <div>
          <span>
            <b>Рекомендации:</b> {steamGame.n_recommendation || 0}
          </span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => handleUpdateData(steamGame.id)}
        >
          Обновить данные
        </Button>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SteamGameModal;
