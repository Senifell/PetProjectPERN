import React, { useState, useEffect, useCallback } from "react";
import SteamGamesDataService from "../services/steam-games.service";
import PrivateGamesDataService from "../services/private-games.service";
import ErrorComponent from "./error.component";

import Pagination from "./Pagination";

import { useUser } from "../userContext";

import SteamGameModal from "./steam-games-modal.component";
import SteamGamesTable from "./steam-games-table.component";

import { toast } from "react-toastify";

function SteamGames() {
  const { user } = useUser();
  const mode = false; //Изменить после добавления ролей

  const [steamGames, setSteamGames] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("nameAsc");

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
  const [hasLanguage, setHasLanguage] = useState("all");

  const getSteamGames = useCallback(() => {
    SteamGamesDataService.getAll(
      user.id,
      currentPage,
      pageSize,
      searchTerm,
      isFree,
      hasLanguage,
      sortBy
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
  }, [user.id, currentPage, pageSize, searchTerm, isFree, hasLanguage, sortBy]);

  useEffect(() => {
    getSteamGames();
  }, [getSteamGames]);

  const handleUpdateAll = () => {
    SteamGamesDataService.updateAll(user.id, "list-games") // Обновить список игр из Стим
      .then((response) => {
        getSteamGames();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const handleUpdateAllInfo = () => {
  //   SteamGamesDataService.updateAll(user.id, "info") // обновить инфу по всем играм
  //     .then(() => {
  //       getSteamGames();
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

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
    toast(`Функция удаления недоступна в текущий момент.`, {
      theme: "dark",
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleIsFreeChange = (e) => {
    setIsFree(e.target.value);
    setCurrentPage(1);
  };

  const handleHasLanguageChange = (e) => {
    setHasLanguage(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleAddToPrivateGame = (game) => {
    PrivateGamesDataService.create(user.id, {
      id_app_steam: game.id_app_steam,
      id_user: user.id,
    })
      .then(() => {
        toast(`Игра ${game.name} успешно добавлена в список личных игр.`, {
          theme: "dark",
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          toast.error("Игра уже существует в вашем списке.");
        } else {
          toast.error("Произошла ошибка при добавлении игры.");
        }
      });
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-center">
        <h2 className="header-2 text-center flex-grow-1">Список игр Steam</h2>
        {!mode && (
          <div className="justify-content-end">
            <button
              className="btn btn-outline-primary"
              onClick={handleUpdateAll}
            >
              Обновить &#8634;
            </button>
          </div>
        )}
      </div>

      {/* <span> </span>
      <button className="btn btn-secondary" onClick={handleUpdateAllInfo}>
        Обновить данные по всем играм
      </button> */}
      <SteamGamesTable
        steamGames={steamGames.items}
        isFree={isFree}
        hasLanguage={hasLanguage}
        searchGameByName={searchTerm}
        sortBy={sortBy}
        handleIsFreeChange={handleIsFreeChange}
        handleHasLanguageChange={handleHasLanguageChange}
        handleSearch={handleSearch}
        handleDelete={handleDelete}
        handleUpdateData={handleUpdateData}
        handleMoreData={handleMoreData}
        handleAddToPrivateGame={handleAddToPrivateGame}
        handleSort={handleSort}
      />

      <div>
        <SteamGameModal
          showModal={showModal}
          setShowModal={setShowModal}
          steamGame={newGame}
          handleUpdateData={handleUpdateData}
        />
      </div>

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
