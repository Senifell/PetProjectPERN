import React, { useState, useEffect, useCallback } from "react";
import CollectionGamesData from "../services/collection-games.service";
import ErrorComponent from "./error.component";
import { useUser } from "../userContext";
import { useNavigate } from "react-router-dom";
import EditCollectionModal from "./edit-collection-modal";

function ListGamesBox({ list, onUpdateList, onDelete, privateMode }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [games, setGames] = useState([]);
  const [showAllGames, setShowAllGames] = useState(false);

  const getCollectionGames = useCallback(() => {
    (!privateMode
      ? CollectionGamesData.getAllPublic(list.id)
      : CollectionGamesData.getAll(list.id, user.id)
    )
      .then((response) => {
        setGames(response.data);
      })
      .catch((e) => {
        setError(e.message || "Что-то пошло не так");
      });
  }, [user, list.id, privateMode]);

  useEffect(() => {
    getCollectionGames();
  }, [getCollectionGames]);

  const handleDelete = () => {
    onDelete(list.id);
  };

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    getCollectionGames();
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
      <p className="description-collection">{list.description}</p>
      <div className="games-list">
        {games.length > 0
          ? `Игры:${String.fromCharCode(160)}`
          : "Список игр пуст"}
        {games.slice(0, showAllGames ? games.length : 5).map((game, index) => (
          <React.Fragment key={game.id}>
            {index > 0 && <span>, &nbsp;</span>}
            <div className="game-item">
              <span>{game.name}</span>
            </div>
          </React.Fragment>
        ))}
        {!showAllGames && games.length > 5 && (
          <button onClick={toggleShowAllGames} className="show-more-button">
            ...
          </button>
        )}
      </div>
      {privateMode && (
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
      )}

      {privateMode && (
        <EditCollectionModal
          show={showModal}
          onHide={handleModalClose}
          list={list}
          onUpdateList={onUpdateList}
        />
      )}
    </div>
  );
}

export default ListGamesBox;
