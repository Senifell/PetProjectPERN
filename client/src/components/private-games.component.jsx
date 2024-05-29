import React, { useState, useEffect, useCallback } from "react";
import privateGamesDataServiceInstance from "../services/private-games.service";
import ErrorComponent from "./error.component";

import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Modal,
} from "react-bootstrap";

// import AddPrivateGames from "./add-private-games.component";
import { useUser } from "../userContext";

// import styles from "./list-games.css";

function PrivateGames() {
  const { user } = useUser();
  //   const navigate = useNavigate();

  const [privateGames, setPrivateGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [newGame, setNewGame] = useState({
    name: "",
    description: "",
    min_player: null,
    max_player: null,
    id_user: user.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Проверяем, что значение не является элементом DOM
    if (typeof value === "string" || typeof value === "number") {
      setNewGame((prevGame) => ({
        ...prevGame,
        [name]: value,
      }));
    }
  };

  const getPrivateGames = useCallback(() => {
    privateGamesDataServiceInstance
      .getAll(user.id)
      .then((response) => {
        setPrivateGames(response.data);
      })
      .catch((e) => {
        setError(e.message || "Что-то пошло не так");
      });
  }, [user.id]);

  useEffect(() => {
    getPrivateGames();
  }, [getPrivateGames]);

  const handleUpdateClick = (game) => {
    setNewGame(game);
    setIsEditing(true);
    setShowModal(true); // Открываем модальное окно для редактирования
  };

  const handleUpdate = () => {
    privateGamesDataServiceInstance
      .update(newGame.id, newGame)
      .then(() => {
        getPrivateGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = (id) => {
    privateGamesDataServiceInstance
      .delete(id)
      .then(() => {
        setPrivateGames(privateGames.filter((game) => game.id !== id));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    if (!newGame.name) {
      alert("Пожалуйста, заполните поле 'Название'");
      return;
    }

    if (isEditing) {
      handleUpdate();
    } else {
      handleAdd(); // Передаем newGame в обработчик handleAdd
    }

    setShowModal(false); // Закрываем модальное окно
    setNewGame({
      name: "",
      description: "",
      min_player: null,
      max_player: null,
      id_user: user.id,
    });
    setIsEditing(false);
  };

  const handleAdd = () => {
    privateGamesDataServiceInstance
      .create(newGame)
      .then(() => {
        getPrivateGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAddButtonClick = () => {
    setShowModal(true);
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div className="container">
      <h2 className="bg-beige p-3">Список игр</h2>
      <button onClick={handleAddButtonClick}>Добавить</button>

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
              <FormLabel htmlFor="min_player">
                Мин. количество игроков
              </FormLabel>
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
              <FormLabel htmlFor="max_player">
                Макс. количество игроков
              </FormLabel>
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
            <Button variant="primary" onClick={handleSubmit}>
              Сохранить
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <table className="table">
        <thead className="bg-beige">
          <tr>
            <th scope="col">Название</th>
            <th scope="col">Мин. количество игроков</th>
            <th scope="col">Макс. количество игроков</th>
            <th scope="col">Время игры (мин)</th>
            <th scope="col">Описание</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {privateGames.map((game) => (
            <tr key={game.id}>
              <td>{game.name}</td>
              <td>{game.min_player}</td>
              <td>{game.max_player}</td>
              <td>{game.n_playtime}</td>
              <td>{game.description}</td>
              <td>
                <button onClick={() => handleUpdateClick(game)}>
                  Редактировать
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(game.id)}>&#128465;</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrivateGames;
