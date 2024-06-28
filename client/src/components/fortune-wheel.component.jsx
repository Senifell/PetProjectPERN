import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import CollectionGamesData from "../services/collection-games.service";
import ErrorComponent from "./error.component";
import { Wheel } from "react-custom-roulette";
import { useUser } from "../userContext";

import "./wheel.css";

function FortuneWheelPage() {
  const { id } = useParams();
  const { user } = useUser();
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

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
    CollectionGamesData.getAll(id, user.id)
      .then((response) => {
        setGames(response.data);
        setError(null);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Something went wrong");
        setIsLoading(false);
      });
  }, [id, user.id]);

  useEffect(() => {
    getCollectionGames();
  }, [getCollectionGames]);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * games.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  // Функция для генерации случайного цвета
  // const getRandomColor = () => {
  //   const letters = "0123456789ABCDEF";
  //   let color = "#";
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   console.log(color);
  //   return color;
  // };

  const data = games.map((game, index) => ({
    option: game.name,
  }));

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (!isLoading) {
    return (
      <div>
        <Wheel
          className="custom-wheel"
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false);
            setSelectedGame(games[prizeNumber]);
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
          perpendicularText={true}
        />
        <button
          className="btn btn-success"
          onClick={handleSpinClick}
          disabled={mustSpin}
        >
          Крутить!
        </button>
        {selectedGame && (
          <div>
            <p>Победитель: {selectedGame.name}</p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }
}

export default FortuneWheelPage;
