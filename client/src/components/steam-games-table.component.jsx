import React, { useState } from "react";
import ShowLongField from "./show-long-field.component";
import "./steam-games.css";

const SteamGamesTable = ({
  steamGames,
  isFree,
  hasLanguage,
  searchGameByName,
  sortBy,
  handleIsFreeChange,
  handleHasLanguageChange,
  handleSearch,
  handleDelete,
  handleUpdateData,
  handleMoreData,
  handleAddToPrivateGame,
  handleSort,
}) => {
  return (
    <div>
      <div className="filter-container mb-2">
        <div className="row mb-2">
          <div className="col-md-6 d-flex">
            <div className="col-6">
              <div className="form-floating">
                <select
                  name="isFree"
                  id="isFree"
                  className="form-select"
                  value={isFree}
                  onChange={handleIsFreeChange}
                  aria-label="Статус"
                >
                  <option value="all">Все</option>
                  <option value="free">Бесплатные</option>
                  <option value="no_free">Платные</option>
                </select>
                <label htmlFor="isFree">Статус</label>
              </div>
            </div>
            <div className="col-6 p-0">
              <div className="form-floating">
                <select
                  name="language"
                  id="language"
                  className="form-select"
                  value={hasLanguage}
                  onChange={handleHasLanguageChange}
                  aria-label="Язык"
                >
                  <option value="all">Все</option>
                  <option value="rus">Русский</option>
                  <option value="en">Английский</option>
                </select>
                <label htmlFor="language">Язык</label>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-6">
            <div className="form-floating">
              <input
                type="search"
                id="searchTerm"
                className="form-control"
                placeholder=""
                value={searchGameByName}
                onChange={handleSearch}
                style={{ width: "100%" }}
              />
              <label htmlFor="searchTerm" style={{ color: "#808080" }}>
                Поиск по названию
              </label>
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-end align-items-end">
            <div className="form-floating">
              <select
                name="sort"
                id="sort"
                className="form-select"
                value={sortBy}
                onChange={handleSort}
                style={{ width: "auto" }}
              >
                <option value="nameAsc">Название &nbsp; &#9650;</option>
                <option value="nameDesc">Название &nbsp; &#9660;</option>
                <option value="recommendationAsc">
                  Рекомендации &nbsp; &#9650;
                </option>
                <option value="recommendationDesc">
                  Рекомендации &nbsp; &#9660;
                </option>
              </select>
              <label htmlFor="sort">Сортировка</label>
            </div>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="table">
          <thead className="bg-beige">
            <tr>
              <th scope="col" className="col-action-add"></th>
              <th scope="col" className="col-title">
                Название
              </th>
              <th scope="col" className="col-description">
                Описание
              </th>
              <th scope="col" className="col-status">
                Статус
              </th>
              <th scope="col" className="col-genre">
                Жанры
              </th>
              <th scope="col" className="col-recommendation">
                Рекомендации
              </th>
              <th scope="col" className="col-action"></th>
              <th scope="col" className="col-action"></th>
              <th scope="col" className="col-action"></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(steamGames) && steamGames.length > 0 ? (
              steamGames.map((game) => (
                <tr key={game.id}>
                  <td className="col-action-add">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToPrivateGame(game)}
                    >
                      <span>+</span>
                    </button>
                  </td>
                  <td className="col-title">{game.name}</td>
                  <ShowLongField
                    longField={game.short_description}
                    numberSymbol={50}
                  />
                  <td className="col-status">
                    {game.is_free === true
                      ? "Бесплатная"
                      : game.is_free === false
                      ? "Платная"
                      : "Не указано"}
                  </td>
                  <td className="col-genre">{game.genres}</td>
                  <td className="col-recommendation">
                    {game.n_recommendation}
                  </td>
                  <td className="col-action">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleUpdateData(game.id)}
                    >
                      Обновить
                    </button>
                  </td>
                  <td className="col-action">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleMoreData(game)}
                    >
                      Подробнее
                    </button>
                  </td>
                  <td className="col-action">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(game.id)}
                    >
                      Удалить
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
      </div>
    </div>
  );
};

export default SteamGamesTable;
