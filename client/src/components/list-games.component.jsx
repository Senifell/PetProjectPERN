import React, { useState, useEffect, useCallback } from "react";
import ListGamesDataService from "../services/list-games.service";
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
    ListGamesDataService.getAll(user.id)
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
    ListGamesDataService.update(id, newData)
      .then(() => {
        getListGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = (id) => {
    ListGamesDataService.deleteListGame(id)
      .then(() => {
        getListGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAdd = (newGame) => {
    ListGamesDataService.create(newGame)
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
    <div>
      <h2>Пользовательские коллекции игр</h2>
      <div>
        Нажмите "редактировать", чтобы изменить описание коллекции и доступный
        список игр. Публичные коллекции доступны всем пользователям сайта,
        личные коллекции видите только Вы.
      </div>
      <div>
        Нажмите на значок{" "}
        <img
          src="/images/spin_wheel.png"
          alt="Spin Wheel"
          className="button-spin-wheel"
        />
        , чтобы открыть Колесо Фортуны выбранной коллекции! Опция доступна
        только для коллекций с двумя и более играми. (:
      </div>
      <br />
      <div className="list-games-container">
        {listGames.map((list) => (
          <ListGamesBox
            key={list.id}
            list={list}
            onUpdateList={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
        <AddListGamesBox onAdd={handleAdd} id_user={user.id} />
      </div>
    </div>
  );
}

export default ListGames;
