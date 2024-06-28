import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect, useCallback } from "react";
import CollectionGamesData from "../services/collection-games.service";
import ErrorComponent from "./error.component";
import { useUser } from "../userContext";
import PrivateGamesDataService from "../services/private-games.service";

import { useNavigate } from "react-router-dom";

function ListGamesBox({ list, onUpdateList, onDelete }) {
  const navigate = useNavigate();

  const { user } = useUser();
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [games, setGames] = useState([]);
  const [oldGames, setOldGames] = useState([]); // те, которые были в коллекции до редактирования
  const [listGames, setListGames] = useState({
    name: list.name,
    description: list.description,
    b_private: list.b_private,
    id_user: list.id_user,
  });
  const [privateGames, setPrivateGames] = useState([]);
  const [showAllGames, setShowAllGames] = useState(false);

  const getCollectionGames = useCallback(() => {
    CollectionGamesData.getAll(list.id, user.id)
      .then((response) => {
        setGames(response.data);
        setOldGames(response.data);
      })
      .catch((e) => {
        setError(e.message || "Что-то пошло не так");
      });
  }, [user.id, list.id]);

  useEffect(() => {
    getCollectionGames();
  }, [getCollectionGames]);

  const getPrivateGames = useCallback(() => {
    PrivateGamesDataService.getAll(user.id)
      .then((response) => {
        setPrivateGames(response.data);
      })
      .catch((e) => {
        setError(e.message || "Что-то пошло не так");
      });
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListGames((prevListGames) => ({
      ...prevListGames,
      [name]: name === "b_private" ? value === "true" : value,
    }));
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setListGames((prevListGames) => ({
      ...prevListGames,
      b_private: value === "true",
    }));
  };

  const handleUpdate = () => {
    onUpdateList(list.id, { ...listGames });

    if (games.length > 0) {
      const newGamesToAdd = games
        .filter(
          (game) =>
            !oldGames.some((oldGame) => oldGame.id_game === game.id_game)
        )
        .map((game) => game.id_game);

      CollectionGamesData.addGamesToCollection(list.id, user.id, newGamesToAdd)
        .then((response) => {
          getCollectionGames();
        })
        .catch((e) => {
          setError(e.message || "Что-то пошло не так");
        });
    }

    if (oldGames.length > 0) {
      const deletedGames = oldGames
        .filter(
          (oldGame) => !games.some((game) => game.id_game === oldGame.id_game)
        )
        .map((game) => game.id_game);

      if (deletedGames.length > 0) {
        CollectionGamesData.deleteGamesFromCollection(
          list.id,
          user.id,
          deletedGames
        )
          .then((response) => {
            getCollectionGames();
          })
          .catch((e) => {
            setError(e.message || "Что-то пошло не так");
          });
      }
    }

    setGames([]);
    setOldGames([]);

    setShowModal(false);
  };

  const handleDelete = () => {
    onDelete(list.id);
  };

  const handleEdit = () => {
    setShowModal(true);
    getPrivateGames();
  };

  const addNewGameToCollection = (idGame, name) => {
    if (!games.some((game) => game.id_game === idGame)) {
      setGames((prevGames) => [...prevGames, { id_game: idGame, name }]);
    }
  };

  const removeGame = (idGame) => {
    setGames((prevGames) =>
      prevGames.filter((game) => game.id_game !== idGame)
    );
  };

  const toggleShowAllGames = () => {
    setShowAllGames(!showAllGames);
  };

  const handleSpinClick = () => {
    navigate(`/list-games/fortune-wheel/${list.id}`);
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div className="list-games-box">
      <div className="list-header">
        <h3>{list.name}</h3>
        {games.length > 1 && (
          <div className="spin-wheel-container">
            <img
              src="/images/spin_wheel.png"
              alt="Spin Wheel"
              className="button-spin-wheel"
              onClick={handleSpinClick}
            />
            <span className="tooltip-text">Крутить!</span>
          </div>
        )}
      </div>
      <p>{list.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {games.length > 0
          ? `Игры:${String.fromCharCode(160)}`
          : "Список игр пуст"}
        {games.slice(0, showAllGames ? games.length : 5).map((game, index) => (
          <React.Fragment key={game.id}>
            {index > 0 && <span>,&nbsp;</span>}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>{game.name}</span>
            </div>
          </React.Fragment>
        ))}
        {!showAllGames && games.length > 5 && (
          <button
            onClick={toggleShowAllGames}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            ...
          </button>
        )}
      </div>
      <div className="button-container">
        <button
          className="btn btn-outline-primary custom-button"
          onClick={handleEdit}
        >
          Редактировать
        </button>
        <button
          className="btn btn-outline-danger custom-button"
          onClick={handleDelete}
        >
          Удалить
        </button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span>Коллекция: {list.name}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="name">Название коллекции</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Название"
              name="name"
              value={listGames.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              className="form-control"
              id="description"
              placeholder="Описание"
              name="description"
              value={listGames.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Доступность</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="b_private"
                  value="true"
                  checked={listGames.b_private === true}
                  onChange={handleRadioChange}
                />
                Личная коллекция
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="b_private"
                  value="false"
                  checked={listGames.b_private === false}
                  onChange={handleRadioChange}
                />
                Публичная коллекция
              </label>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {games.map((game, index) => (
              <React.Fragment key={game.id}>
                {index > 0 && <span>, </span>}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{game.name}</span>
                  <button
                    onClick={() => removeGame(game.id_game)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <span>&otimes;</span>
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>

          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={() => handleUpdate(list.id)}>
            Сохранить
          </Button>

          <table className="table">
            <thead className="bg-beige">
              <tr>
                <th scope="col"></th>
                <th scope="col">Название</th>
                <th scope="col">Мин. количество игроков</th>
                <th scope="col">Макс. количество игроков</th>
                <th scope="col">Время игры (час)</th>
                <th scope="col">Описание</th>
              </tr>
            </thead>
            <tbody>
              {privateGames.map((game) => (
                <tr key={game.id}>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => addNewGameToCollection(game.id, game.name)}
                      disabled={games.some((g) => g.id_game === game.id)}
                    >
                      <span>+</span>
                    </button>
                  </td>
                  <td>{game.name}</td>
                  <td>{game.min_player}</td>
                  <td>{game.max_player}</td>
                  <td>{game.n_playtime}</td>
                  <td>{game.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

export default ListGamesBox;
