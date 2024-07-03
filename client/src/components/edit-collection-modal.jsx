import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal } from "react-bootstrap";
import CollectionGamesData from "../services/collection-games.service";
import ErrorComponent from "./error.component";
import { useUser } from "../userContext";

import Pagination from "./Pagination";
import GamesTable from "./private-games-table.component";
import usePrivateGames from "../hooks/usePrivateGames";

function EditCollectionModal({ show, onHide, list, onUpdateList }) {
  const { user } = useUser();
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [oldGames, setOldGames] = useState([]);
  const [listGames, setListGames] = useState({
    name: list.name,
    description: list.description,
    b_private: list.b_private,
    id_user: list.id_user,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const { privateGames, errorPrivateGames, getPrivateGames } = usePrivateGames(
    user.id,
    currentPage,
    pageSize
  );

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
    getPrivateGames();
  }, [getCollectionGames, getPrivateGames]);

  useEffect(() => {
    setError(errorPrivateGames);
  }, [errorPrivateGames]);

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
        .then(() => {
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
          .then(() => {
            getCollectionGames();
          })
          .catch((e) => {
            setError(e.message || "Что-то пошло не так");
          });
      }
    }

    setGames([]);
    setOldGames([]);

    onHide();
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

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <Modal show={show} onHide={onHide}>
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
            <React.Fragment key={game.id_game}>
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

        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Сохранить
        </Button>
        <GamesTable
          games={privateGames.items}
          editMode={false}
          addToCollection={addNewGameToCollection}
        />
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={privateGames.totalItems}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}

export default EditCollectionModal;
