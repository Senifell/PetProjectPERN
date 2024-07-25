import React, { useState, useEffect, useCallback } from "react";
import CollectionGamesData from "../services/collection-games.service";
import ErrorComponent from "./error.component";
import { useUser } from "../userContext";

import Pagination from "./Pagination";
import GamesTable from "./private-games-table.component";
import usePrivateGames from "../hooks/usePrivateGames";

import SteamGamesTable from "./steam-games-table.component";
import useSteamGames from "../hooks/useSteamGames";

import AddCustomGame from "./add-custom-game.component";

import { Modal, Box, Button, ButtonGroup } from "@mui/material";

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

  const { steamGames, errorSteamGames, getSteamGames } = useSteamGames(
    user.id,
    currentPage,
    pageSize
  );

  const [modeSelectGame, setModeSelectGame] = useState(null);

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
    getSteamGames();
  }, [getCollectionGames, getPrivateGames, getSteamGames]);

  useEffect(() => {
    setError(errorPrivateGames);
  }, [errorPrivateGames]);

  useEffect(() => {
    setError(errorSteamGames);
  }, [errorSteamGames]);

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
      const newGamesToAdd = games.filter(
        (game) =>
          !oldGames.some(
            (oldGame) =>
              oldGame.id_game === game.id_game ||
              oldGame.id_steam_game === game.id_steam_game ||
              oldGame.id === game.id
          )
      );

      CollectionGamesData.addGamesToCollection(list.id, user.id, newGamesToAdd)
        .then(() => {
          getCollectionGames();
        })
        .catch((e) => {
          setError(e.message || "Что-то пошло не так");
        });
    }

    if (oldGames.length > 0) {
      const deletedGames = oldGames.filter(
        (oldGame) =>
          !games.some(
            (game) =>
              (game.id_game !== null && game.id_game === oldGame.id_game) ||
              (game.id_steam_game !== null &&
                game.id_steam_game === oldGame.id_steam_game) ||
              (game.id !== null && game.id === oldGame.id)
          )
      );

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

  const addNewSteamGameToCollection = (idSteamGame, name) => {
    if (!games.some((game) => game.id_steam_game === idSteamGame)) {
      setGames((prevGames) => [
        ...prevGames,
        { id_steam_game: idSteamGame, name },
      ]);
    }
  };

  const addCustomGameToCollection = (name) => {
    setGames((prevGames) => [...prevGames, { name: name }]);
  };

  const removeGame = (idGame, idSteamGame, customName) => {
    if (idGame) {
      setGames((prevGames) =>
        prevGames.filter((game) => game.id_game !== idGame)
      );
    } else if (idSteamGame) {
      setGames((prevGames) =>
        prevGames.filter((game) => game.id_steam_game !== idSteamGame)
      );
    } else if (customName) {
      setGames((prevGames) =>
        prevGames.filter((game) => game.name !== customName)
      );
    }
  };

  const changeModeSelectGame = (mode) => {
    setModeSelectGame(mode);
  };

  const close = () => {
    setModeSelectGame(null);
    onHide();
  };

  const boxStyle = {
    width: "60%",
    // height: "auto",
    maxHeight: "90vh", // Ограничение высоты модального окна
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    border: "5px solid #328daa",
    borderRadius: "10px",
    padding: "20px",
    boxSizing: "border-box",
    position: "relative",
  };

  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <Modal sx={modalStyle} open={show} onClose={close}>
      <Box sx={boxStyle}>
        <div className="lead container p-3" style={{ position: "relative" }}>
          <div className="row">
            <div className="col-md-4">
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
            </div>
            <div className="col-md-8">
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div>Список игр:</div>
                {games.map((game, index) => (
                  <React.Fragment
                    key={`${game.id}-${game.id_game}-${game.id_steam_game}`}
                  >
                    {index > 0 && <span>, </span>}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span>{game.name}</span>
                      <button
                        onClick={() =>
                          removeGame(
                            game.id_game,
                            game.id_steam_game,
                            game.name
                          )
                        }
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
              <Box
                sx={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <Button
                  sx={{ background: "grey", marginRight: "10px" }}
                  size="medium"
                  variant="contained"
                  onClick={close}
                >
                  Закрыть
                </Button>
                <Button
                  size="medium"
                  sx={{
                    background: "green",
                  }}
                  variant="contained"
                  onClick={handleUpdate}
                >
                  Сохранить
                </Button>
              </Box>
            </div>
          </div>
        </div>

        <ButtonGroup
          variant="text"
          size="large"
          aria-label="Basic button group"
        >
          <Button onClick={() => changeModeSelectGame("private")}>
            Личные игры
          </Button>
          <Button onClick={() => changeModeSelectGame("steam")}>
            Steam игры
          </Button>
          <Button onClick={() => changeModeSelectGame("custom")}>
            Ручной ввод
          </Button>
        </ButtonGroup>

        {modeSelectGame === "private" && (
          <>
            <GamesTable
              games={privateGames.items}
              collectionGames={games}
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
          </>
        )}

        {modeSelectGame === "steam" && (
          <>
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <SteamGamesTable
                steamGames={steamGames.items}
                handleAddToCollection={addNewSteamGameToCollection}
                editMode={false}
              />
            </div>
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={steamGames.totalItems}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}

        {modeSelectGame === "custom" && (
          <>
            <AddCustomGame
              addCustomGameToCollection={addCustomGameToCollection}
            />
          </>
        )}
      </Box>
    </Modal>
  );
}

export default EditCollectionModal;
