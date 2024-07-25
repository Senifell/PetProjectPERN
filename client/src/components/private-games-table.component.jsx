import React from "react";
import ShowLongField from "./show-long-field.component";
import "./private-games.css";

const GamesTable = ({
  games,
  collectionGames,
  handleUpdateClick,
  handleDelete,
  editMode,
  addToCollection,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className={`bg-beige ${editMode ? "lead" : ""}`}>
          <tr>
            {!editMode && <th scope="col"></th>}
            <th scope="col" className="col-title py-3">
              Название
            </th>
            <th scope="col" className="col-min-players py-3">
              Мин. игроков
            </th>
            <th scope="col" className="col-max-players">
              Макс. игроков
            </th>
            <th scope="col" className="col-playtime">
              Время игры (ч)
            </th>
            <th scope="col" className="col-description">
              Описание
            </th>
            {editMode && (
              <>
                <th scope="col" className="col-action"></th>
                <th scope="col" className="col-action"></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(games) && games.length > 0 ? (
            games.map((game) => (
              <tr key={game.id}>
                {!editMode && (
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => addToCollection(game.id, game.name)}
                      disabled={collectionGames.some(
                        (g) => g.id_game === game.id
                      )} //! Починить
                    >
                      <span>+</span>
                    </button>
                  </td>
                )}
                <td className="col-title">{game.name}</td>
                <td className="col-min-players">{game.min_player}</td>
                <td className="col-max-players">{game.max_player}</td>
                <td className="col-playtime">{game.n_playtime}</td>
                <ShowLongField longField={game.description} />
                {editMode && (
                  <>
                    <td className="col-action">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleUpdateClick(game)}
                      >
                        Редактировать
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
                  </>
                )}
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
  );
};

export default GamesTable;
