import React, { useState, useEffect, useCallback } from "react";
import listGamesDataServiceInstance from "../services/list-games.service";
import ListGamesBox from "./list-games-box.component";
import AddListGamesBox from "./add-list-games-box.component";
import ErrorComponent from "./error.component";
import { useUser } from "../userContext";
import "./list-games.css";

function ListGames() {
  const { user } = useUser();

  const [listGames, setListGames] = useState([]);
  const [error, setError] = useState(null);

  const getListGames = useCallback(() => {
    listGamesDataServiceInstance
      .getAll(user.id)
      .then((response) => {
        setListGames(response.data);
      })
      .catch((e) => {
        setError(e.message || "Что-то пошло не так");
      });
  }, [user.id]);

  useEffect(() => {
    getListGames();
  }, [getListGames]);

  const handleUpdate = (id, newData) => {
    listGamesDataServiceInstance
      .update(id, newData)
      .then(() => {
        getListGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = (id) => {
    listGamesDataServiceInstance
      .delete(id)
      .then(() => {
        getListGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAdd = (newGame) => {
    listGamesDataServiceInstance
      .create(newGame)
      .then(() => {
        getListGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div className="list-games-container">
      {listGames.map((game) => (
        <ListGamesBox
          key={game.id}
          game={game}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
      <AddListGamesBox onAdd={handleAdd} id_user={user.id} />
    </div>
  );
}

export default ListGames;
