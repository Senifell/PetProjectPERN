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
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Об игре</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <span>Название: {steamGame.name}</span>
        </div>
        <div>
          <span>Статус: {!steamGame.is_free ? "Платная" : "Бесплатная"}</span>
        </div>
        <div>
          <span>Возраст: {steamGame.required_age}+</span>
        </div>
        <div>
          <span>Поддерживаемые языки: {steamGame.supported_languages}</span>
        </div>
        <div>
          <span>Жанры: {steamGame.genres}</span>
        </div>
        <div>
          <span>Категории: {steamGame.categories}</span>
        </div>
        <div>
          <span>Краткое описание: {steamGame.short_description}</span>
        </div>
        <div>
          <span>Дата релиза: {steamGame.release_date}</span>
        </div>
        <div>
          <span>Рекомендации: {steamGame.n_recommendation}</span>
        </div>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Закрыть
        </Button>
        <Button
          variant="primary"
          onClick={() => handleUpdateData(steamGame.id)}
        >
          Обновить
        </Button>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default SteamGameModal;
