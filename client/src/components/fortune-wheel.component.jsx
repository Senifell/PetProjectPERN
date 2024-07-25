import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import CollectionGamesData from "../services/collection-games.service";
import ErrorComponent from "./error.component";
import { Wheel } from "react-custom-roulette";
import { useUser } from "../userContext";

import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import "./wheel.css";

function FortuneWheelPage() {
  const { id } = useParams();
  const { user } = useUser();
  const [games, setGames] = useState([]);
  const [excludedGames, setExcludedGames] = useState([]);
  const [eliminatedGames, setEliminatedGames] = useState([]);
  const [error, setError] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedMode, setSelectedMode] = useState("singleWinner");
  const [eventList, setEventList] = useState([]);

  const eventsEndRef = useRef(null);

  const BackgroundColor = [
    "#6ab04c",
    "#f9d71c",
    "#9e4770",
    "#cd6839",
    "#3f3f44",
    "#448ee4",
    "#8c5e00",
    "#7bb0a6",
    "#2a2b2d",
    "#3f6f91",
    "#1e5945",
    "#a39e85",
    "#a14a76",
    "#c1421c",
    "#dc1f26",
    "#002554",
    "#f8b24e",
    "#734b6d",
    "#9d4b00",
    "#00a0b0",
  ];

  const getCollectionGames = useCallback(() => {
    CollectionGamesData.getAllPublic(id, user.id)
      .then((response) => {
        setGames(response.data);
        setError(null);
        setIsLoading(false);
        setSelectedGame(null);
        setExcludedGames([]);
        setEliminatedGames([]);
      })
      .catch((e) => {
        setError(e.message || "Something went wrong");
        setIsLoading(false);
      });
  }, [id, user.id]);

  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [eventList]);

  useEffect(() => {
    getCollectionGames();
  }, [getCollectionGames]);

  const handleSpinClick = () => {
    setSelectedGame(null);
    if (games.length === 1) {
      setPrizeNumber(0);
      setSelectedGame(games[0]);
      return;
    }
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * games.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const deleteFromWheelGame = (id) => {
    const gameToRemove = games.find((game) => game.id === id);

    if (gameToRemove && games.length === 1) {
      addMessageToEventList("Нельзя исключить все игры!");
      return;
    }

    if (gameToRemove) {
      const updatedGames = games.filter((game) => game.id !== id);
      const updatedExcludedGames = [...excludedGames, gameToRemove];

      setGames(updatedGames);
      setExcludedGames(updatedExcludedGames);
      addMessageToEventList(
        `Игра ${gameToRemove.name} исключена из списка игр.`
      );
    } else {
      addMessageToEventList(
        `Ошибка исключения игры ${gameToRemove.name} из списка игр.`
      );
    }
  };

  const deleteFromExcludedGame = (id) => {
    console.log(excludedGames);
    const gameToReturn = excludedGames.find((game) => game.id === id);
    if (gameToReturn) {
      const updatedExcludedGames = excludedGames.filter(
        (game) => game.id !== id
      );
      const updatedGames = [...games, gameToReturn];

      setGames(updatedGames);
      setExcludedGames(updatedExcludedGames);
      addMessageToEventList(
        `Игра ${gameToReturn.name} возвращена в список игр.`
      );
    } else {
      addMessageToEventList(
        `Ошибка возвращения игры ${gameToReturn.name} в список игр.`
      );
    }
  };

  const changeMode = (event) => {
    setSelectedMode(event.target.value);

    addMessageToEventList(
      `Режим изменен. Текущий режим: ${
        event.target.value === "singleWinner"
          ? "Один победитель"
          : "Игра на выбывание"
      }`
    );
  };

  const addMessageToEventList = (message) => {
    setEventList((prevEventList) => [
      ...prevEventList,
      {
        timestamp: new Date(),
        message: message,
      },
    ]);
  };

  const addToEliminatedGames = (eliminatedGame) => {
    let isLast = false;
    const gameToRemove = games.find((game) => game.id === eliminatedGame.id);

    if (gameToRemove && games.length === 2) {
      isLast = true;
    }

    if (gameToRemove) {
      const updatedGames = games.filter(
        (game) => game.id !== eliminatedGame.id
      );
      const updatedEliminatedGames = [...eliminatedGames, gameToRemove];

      setGames(updatedGames);
      setEliminatedGames(updatedEliminatedGames);
      addMessageToEventList(`Игра ${eliminatedGame.name} выбыла.`);
      if (isLast) {
        setSelectedGame(updatedGames[0]);
        addMessageToEventList(`Победитель: ${updatedGames[0].name}`);
      }
    } else {
      addMessageToEventList(`Ошибка выбывания игры ${eliminatedGame.name}.`);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const data = games.map((game) => ({
    option: game.name,
  }));

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <ErrorComponent message={error} />;
  } else {
    return (
      <div className="main-container">
        <div className="winner-display">
          <h3>Победитель: {selectedGame ? selectedGame.name : ""}</h3>
        </div>
        <div className="content-container">
          <div className="left-container">
            <div className="mode-selection">
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Режим
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={selectedMode}
                  onChange={changeMode}
                >
                  <FormControlLabel
                    value="singleWinner"
                    control={<Radio />}
                    label="Один победитель"
                  />
                  <FormControlLabel
                    value="elimination"
                    control={<Radio />}
                    label="Игра на выбывание"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="wheel-container">
              <Wheel
                className="custom-wheel"
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                onStopSpinning={() => {
                  setMustSpin(false);
                  if (selectedMode === "singleWinner") {
                    setSelectedGame(games[prizeNumber]);
                    addMessageToEventList(
                      `Победитель: ${games[prizeNumber].name}`
                    );
                  } else {
                    addToEliminatedGames(games[prizeNumber]);
                  }
                }}
                backgroundColors={BackgroundColor}
                spinDuration={0.1}
                innerRadius={10}
                innerBorderColor={"black"}
                innerBorderWidth={5}
                radiusLineColor={"white"}
                radiusLineWidth={5}
                outerBorderColor={"black"}
                outerBorderWidth={10}
                perpendicularText={false}
              />
              <button
                className="btn btn-primary"
                onClick={handleSpinClick}
                disabled={mustSpin}
              >
                Крутить!
              </button>
            </div>
          </div>
          <div className="right-container">
            <div className="lists-container">
              <div className="section-header">Список игр</div>
              <div className="games-list">
                {games.map((game, index) => (
                  <div className="game-item" key={game.id}>
                    {index > 0 && <span>, &nbsp;</span>}
                    <span>{game.name}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => deleteFromWheelGame(game.id)}
                      style={{
                        marginLeft: "5px",
                        padding: "0 5px",
                        fontSize: "0.8em",
                      }}
                    >
                      <span>x</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="lists-container">
              <div className="section-header">Список исключенных игр</div>
              <div className="games-list">
                {excludedGames.map((game, index) => (
                  <div className="game-item" key={game.id}>
                    {index > 0 && <span>, &nbsp;</span>}
                    <span>{game.name}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => deleteFromExcludedGame(game.id)}
                      style={{
                        marginLeft: "5px",
                        padding: "0 5px",
                        fontSize: "0.8em",
                      }}
                    >
                      <span>x</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {selectedMode === "elimination" && (
              <div className="lists-container">
                <div className="section-header">Список выбывших игр</div>
                <div className="games-list">
                  {eliminatedGames.map((game, index) => (
                    <div className="game-item" key={game.id}>
                      {index > 0 && <span>, &nbsp;</span>}
                      <span>{game.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="events-container">
              <div className="header-container">
                <div className="section-header">Журнал событий</div>
                <button
                  className="btn btn-primary btn-sm clear-button"
                  onClick={() => setEventList([])}
                >
                  <span>Очистить</span>
                </button>
              </div>
              <div className="event-list">
                {eventList.map((event, index) => (
                  <div key={index} className="event-item">
                    {`[${formatTime(event.timestamp)}]: ${event.message}`}
                  </div>
                ))}
                <div ref={eventsEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FortuneWheelPage;
