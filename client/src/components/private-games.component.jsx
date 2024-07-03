import React, { useState, useEffect } from "react";
import ErrorComponent from "./error.component";
import Pagination from "./Pagination";
import GamesTable from "./private-games-table.component";
import GameModal from "./private-games-modal.component";
import PrivateGamesDataService from "../services/private-games.service";

import { Button } from "react-bootstrap";

import { useUser } from "../userContext";
import usePrivateGames from "../hooks/usePrivateGames";

import "./private-games.css";

function PrivateGamesPage() {
  const { user } = useUser();

  const [showModal, setShowModal] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [error, setError] = useState(null);

  const { privateGames, errorPrivateGames, getPrivateGames } = usePrivateGames(
    user.id,
    currentPage,
    pageSize
  );

  useEffect(() => {
    getPrivateGames();
  }, [getPrivateGames]);

  useEffect(() => {
    setError(errorPrivateGames);
  }, [errorPrivateGames]);

  const [newGame, setNewGame] = useState({
    name: "",
    description: "",
    min_player: null,
    max_player: null,
    id_user: user.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (typeof value === "string" || typeof value === "number") {
      setNewGame((prevGame) => ({
        ...prevGame,
        [name]: value,
      }));
    }
  };

  const handleUpdateClick = (game) => {
    const { n_playtime, ...gameToUpdate } = game;
    setNewGame(gameToUpdate);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdate = () => {
    PrivateGamesDataService.update(user.id, newGame.id, newGame)
      .then(() => {
        getPrivateGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = (id) => {
    PrivateGamesDataService.deleteGame(user.id, id)
      .then(() => {
        getPrivateGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newGame.name) {
      alert("Пожалуйста, заполните поле 'Название'");
      return;
    }

    if (isEditing) {
      handleUpdate();
    } else {
      handleAdd();
    }

    setShowModal(false);
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
    PrivateGamesDataService.create(user.id, newGame)
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

  const handleAddSteamButtonClick = () => {
    PrivateGamesDataService.getSteamGames(user.id)
      .then(() => {
        getPrivateGames();
      })
      .catch((e) => {
        setError(e.message || "Что-то пошло не так");
      });
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div className="container">
      <h2>Список игр</h2>
      <Button
        variant="link"
        onClick={() => setShowDescription(!showDescription)}
      >
        Как сформировать список игр
      </Button>
      {showDescription && (
        <div className="description">
          Сформировать список игр можно с помощью ручного добавления игр
          ("Добавить") и с помощью интеграции со своим Steam аккаунтом
          ("Загрузить список игр из Steam"). Для загрузки игр из Steam
          необходимо добавить свой Steam ID в личном кабинете и удостовериться,
          что ваш аккаунт Steam не является приватным.
        </div>
      )}
      <div>Всего игр: {privateGames.totalItems}</div>
      <button className="btn btn-success" onClick={handleAddButtonClick}>
        Добавить
      </button>
      <button className="btn btn-primary" onClick={handleAddSteamButtonClick}>
        Загрузить список игр из Steam
      </button>
      <GamesTable
        games={privateGames.items}
        handleUpdateClick={handleUpdateClick}
        handleDelete={handleDelete}
        editMode={true}
      />
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={privateGames.totalItems}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <GameModal
        showModal={showModal}
        setShowModal={setShowModal}
        newGame={newGame}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default PrivateGamesPage;
