import React, { useState, useEffect, useCallback } from "react";
import ErrorComponent from "./error.component";
import ListGamesDataService from "../services/list-games.service";
import ListGamesBox from "./list-games-box.component";

function PublicListGames() {
  const [isLoading, setIsLoading] = useState(true);
  const [listGames, setListGames] = useState([]);
  const [error, setError] = useState(null);

  const getPublicListGames = useCallback(() => {
    ListGamesDataService.getPublicListGames()
      .then((response) => {
        setListGames(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Что-то пошло не так");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getPublicListGames();
  }, [getPublicListGames]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div>
      <h1 className="h1 my-4 text-center">Коллекции игр</h1>
      <div className="lead">
        Представленные публичные коллекции были созданы пользователями сайта
      </div>
      <br />

      <div className="list-games-container">
        {listGames.map((list) => (
          <ListGamesBox key={list.id} list={list} privateMode={false} />
        ))}
      </div>
    </div>
  );
}

export default PublicListGames;
