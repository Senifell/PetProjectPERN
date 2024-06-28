import React, { useState, useEffect, useCallback } from "react";
import SteamGamesDataService from "../services/steam-games.service";
import ErrorComponent from "./error.component";

import Pagination from "../Pagination";

import { Button, Modal } from "react-bootstrap";

import { useUser } from "../userContext";

function SteamGames() {
  const { user } = useUser();

  const [steamGames, setSteamGames] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const [newGame, setNewGame] = useState({
    id_app_steam: null,
    name: "",
    is_free: null,
    required_age: null,
    supported_languages: "",
    short_description: "",
    categories: "",
    genres: "",
    release_date: null,
    n_recommendation: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFree, setIsFree] = useState("all");
  const [isLanguage, setIsLanguage] = useState("all");

  const getSteamGames = useCallback(() => {
    SteamGamesDataService.getAll(
      user.id,
      currentPage,
      pageSize,
      searchTerm,
      isFree,
      isLanguage
    )
      .then((response) => {
        setSteamGames(
          response.data || {
            items: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
          }
        );
      })
      .catch((e) => {
        setError(e.message || "Что-то пошло не так");
      });
  }, [user.id, currentPage, pageSize, searchTerm, isFree, isLanguage]);

  useEffect(() => {
    getSteamGames();
  }, [getSteamGames]);

  const handleUpdateAll = () => {
    SteamGamesDataService.updateAll(user.id, "list-games") // Обновить список игр из Стим
      .then(() => {
        getSteamGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleUpdateAllInfo = () => {
    SteamGamesDataService.updateAll(user.id, "info") // обновить инфу по всем играм
      .then(() => {
        getSteamGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleMoreData = (game) => {
    setNewGame(game);
    setShowModal(true);
  };

  const handleUpdateData = (id) => {
    SteamGamesDataService.update(id)
      .then(() => {
        getSteamGames();
        SteamGamesDataService.getOne(id)
          .then((response) => {
            setNewGame(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = (id) => {
    alert("Недоступно!");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleIsFreeChange = (e) => {
    setIsFree(e.target.value);
    setCurrentPage(1);
  };

  const handleIsLanguageChange = (e) => {
    setIsLanguage(e.target.value);
    setCurrentPage(1);
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div className="container">
      <h2 className="bg-beige p-3">Список игр</h2>
      <button className="btn btn-primary" onClick={handleUpdateAll}>
        Обновить
      </button>
      <span> </span>
      <button className="btn btn-secondary" onClick={handleUpdateAllInfo}>
        Обновить данные по всем играм
      </button>

      {/* <FormGroup>
        <FormLabel>Поиск по имени</FormLabel>
        <FormControl
          type="search"
          class="form-control rounded"
          placeholder="Введите имя игры"
          value={searchTerm}
          onChange={handleSearch}
        />
      </FormGroup> */}
      <div>
        <label htmlFor="isFree">Статус:</label>
        <select
          name="isFree"
          id="isFree"
          value={isFree}
          onChange={handleIsFreeChange}
        >
          <option value="all">Все</option>
          <option value="free">Бесплатные</option>
          <option value="no_free">Платные</option>
        </select>
      </div>
      <div>
        <label htmlFor="language">Поддерживает язык:</label>
        <select
          name="language"
          id="language"
          value={isLanguage}
          onChange={handleIsLanguageChange}
        >
          <option value="all">Все</option>
          <option value="rus">Русский</option>
          <option value="en">Английский</option>
        </select>
      </div>
      <div>
        <label htmlFor="searchTerm">Поиск по имени</label>
        <input
          type="search"
          id="searchTerm"
          className="form-control rounded"
          placeholder="Введите имя игры"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Об игре</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <span>Название: {newGame.name}</span>
          </div>
          <div>
            <span>Статус: {!newGame.is_free ? "Платная" : "Бесплатная"}</span>
          </div>
          <div>
            <span>Возраст: {newGame.required_age}+</span>
          </div>
          <div>
            <span>Поддерживаемые языки: {newGame.supported_languages}</span>
          </div>
          <div>
            <span>Жанры: {newGame.genres}</span>
          </div>
          <div>
            <span>Категории: {newGame.categories}</span>
          </div>
          <div>
            <span>Краткое описание: {newGame.short_description}</span>
          </div>
          <div>
            <span>Дата релиза: {newGame.release_date}</span>
          </div>
          <div>
            <span>Рекомендации: {newGame.n_recommendation}</span>
          </div>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
          <Button
            variant="primary"
            onClick={() => handleUpdateData(newGame.id)}
          >
            Обновить
          </Button>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <table className="table">
        <thead className="bg-beige">
          <tr>
            <th scope="col">Название</th>
            <th scope="col">Описание</th>
            <th scope="col">Статус</th>
            <th scope="col">Жанры</th>
            <th scope="col">Рекомендации</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(steamGames.items) && steamGames.items.length > 0 ? (
            steamGames.items.map((game) => (
              <tr key={game.id}>
                <td>{game.name}</td>
                <td>{game.short_description}</td>
                <td>
                  {game.is_free === true
                    ? "Бесплатная"
                    : game.is_free === false
                    ? "Платная"
                    : "Не указано"}
                </td>
                <td>{game.genres}</td>
                <td>{game.n_recommendation}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleUpdateData(game.id)}
                  >
                    Обновить данные
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleMoreData(game)}
                  >
                    Подробнее
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(game.id)}
                  >
                    Удалить &#128465;
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Нет данных для отображения</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={steamGames.totalItems}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default SteamGames;
