import React from "react";
import {
  Modal,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
} from "react-bootstrap";

const GameModal = ({
  showModal,
  setShowModal,
  newGame,
  handleChange,
  handleSubmit,
}) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить игру</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="name">Название</FormLabel>
            <FormControl
              type="text"
              id="name"
              placeholder="Название"
              name="name"
              value={newGame.name}
              onChange={handleChange}
              className={!newGame.name ? "is-invalid" : ""}
              required
            />
          </FormGroup>
          <FormControl.Feedback type="invalid">
            Поле "Название" обязательно для заполнения
          </FormControl.Feedback>
          <FormGroup>
            <FormLabel htmlFor="description">Описание</FormLabel>
            <FormControl
              as="textarea"
              id="description"
              placeholder="Описание"
              name="description"
              value={newGame.description}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="min_player">Мин. количество игроков</FormLabel>
            <FormControl
              type="number"
              id="min_player"
              placeholder="Мин. количество игроков"
              name="min_player"
              value={newGame.min_player}
              onChange={handleChange}
              min={0}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="max_player">Макс. количество игроков</FormLabel>
            <FormControl
              type="number"
              id="max_player"
              placeholder="Макс. количество игроков"
              name="max_player"
              value={newGame.max_player}
              onChange={handleChange}
              min={0}
            />
          </FormGroup>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
          <Button variant="success" type="submit">
            Сохранить
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default GameModal;
