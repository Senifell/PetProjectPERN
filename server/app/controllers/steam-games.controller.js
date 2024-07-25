const axios = require("axios");
const db = require("../models");
const sequelize = db.sequelize;
const SteamGames = db.steam_games;
const Op = db.Sequelize.Op;
const _ = require("lodash");

exports.create = (req, res) => {
  // Validate request
  if (!req.body.id_user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const steamGames = {
    id_app_steam: req.body.id_app_steam,
    name: req.body.name,
    is_free: req.body.is_free,
    required_age: req.body.required_age,
    supported_languages: req.body.supported_languages,
    short_description: req.body.short_description,
    categories: req.body.categories,
    genres: req.body.genres,
    release_date: req.body.release_date,
    n_recommendation: req.body.n_recommendation,
    app_type: req.body.app_type,
    b_deleted: 0,
    b_available: req.body.b_available,
  };

  SteamGames.create(steamGames)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the game.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  SteamGames.findOne({ where: { id: id, b_deleted: false } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find game with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving game with id=" + id,
      });
    });
};

exports.findAll = async (req, res) => {
  const {
    userId,
    page = 1,
    pageSize = 50,
    search = "",
    isFree = "all",
    hasLanguage = "all",
    sortBy = "nameAsc",
  } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const countResult = await sequelize.query(
      `SELECT COUNT(id) AS count FROM steam_games
      WHERE b_deleted = false
      AND (b_available = true OR b_available IS NULL)
      AND (app_type = 'game' OR app_type IS NULL)
      AND (name LIKE :search_name)
      AND (supported_languages LIKE :language OR supported_languages IS NULL)
      ${
        isFree === "all"
          ? ""
          : isFree === "free"
          ? "AND is_free = true"
          : "AND is_free = false"
      }`,
      {
        replacements: {
          search_name: search ? `%${search}%` : "%",
          language:
            hasLanguage !== "all"
              ? `%${hasLanguage === "rus" ? "русский" : "английский"}%`
              : "%",
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const rows = await sequelize.query(
      `SELECT * FROM steam_games
      WHERE b_deleted = false
      AND (b_available = true OR b_available IS NULL)
      AND (app_type = 'game' OR app_type IS NULL)
      AND (name LIKE :search_name)
      AND (supported_languages LIKE :language OR supported_languages IS NULL)
      ${
        isFree === "all"
          ? ""
          : isFree === "free"
          ? "AND is_free = true"
          : "AND is_free = false"
      }
      ${
        sortBy === "nameAsc"
          ? "ORDER BY name NULLS LAST"
          : sortBy === "nameDesc"
          ? "ORDER BY name DESC NULLS LAST"
          : sortBy === "recommendationAsc"
          ? "ORDER BY n_recommendation, name NULLS LAST"
          : "ORDER BY n_recommendation DESC NULLS LAST, name"
      }
      LIMIT :limit OFFSET :offset`,
      {
        replacements: {
          search_name: search ? `%${search}%` : "%",
          language:
            hasLanguage !== "all"
              ? `%${hasLanguage === "rus" ? "русский" : "английский"}%`
              : "%",
          limit: parseInt(pageSize, 10),
          offset: parseInt(offset, 10),
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const count = countResult[0].count;

    res.send({
      totalItems: count,
      items: rows,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching steam games:", error);
    res.status(500).send("Internal Server Error");
  }
};

function cleanText(text) {
  // Удаляем HTML-теги с помощью регулярного выражения, удаляем *, лишние фразы и пробелы
  let cleanedText = text.replace(/<[^>]*>/g, "");
  cleanedText = cleanedText.replace(/\*/g, "");
  cleanedText = cleanedText.replace("озвучивание доступно на этих языках", "");
  const trimmedText = cleanedText.trim();
  return trimmedText;
}

async function updateInfoGameSteam(steamGame, err = "") {
  try {
    // Полная информация об игре Steam
    const response = await axios.get(
      "https://store.steampowered.com/api/appdetails",
      { params: { appids: steamGame.id_app_steam, l: "russian" } }
    );
    const gameData = response.data[steamGame.id_app_steam];

    if (gameData && gameData.success) {
      const gameDetails = gameData.data;

      await steamGame.update({
        name: gameDetails.name,
        is_free: gameDetails.is_free,
        required_age: gameDetails.required_age,
        supported_languages: gameDetails.supported_languages
          ? cleanText(gameDetails.supported_languages)
          : null,
        short_description: gameDetails.short_description,
        categories: gameDetails.categories
          ? gameDetails.categories
              .map((category) => category.description)
              .join(", ")
          : null,
        genres: gameDetails.genres
          ? gameDetails.genres.map((genre) => genre.description).join(", ")
          : null,
        release_date: gameDetails.release_date
          ? gameDetails.release_date.date
          : null,
        n_recommendation: gameDetails.recommendations
          ? gameDetails.recommendations.total
          : null,
        app_type: gameDetails.type,
        b_available: gameData.success,
      });

      console.log(
        `Обновлены данные игры id_app_steam=${steamGame.id_app_steam}.`
      );
      return 1;
    } else if (gameData && !gameData.success) {
      await steamGame.update({
        b_available: gameData.success,
      });
      console.log(
        `Обновлены данные игры id_app_steam=${steamGame.id_app_steam}. Игра не доступна.`
      );
      return 1;
    } else {
      console.error(
        `Не удалось получить данные об игре с id=${steamGame.id_app_steam}.`
      );
      err = `Не удалось получить данные об игре с id=${steamGame.id_app_steam}.`;
      return 0;
    }
  } catch (error) {
    if (error.response) {
      // Ошибки, которые приходят от Steam API. Отловим 429
      err = error.response.statusText;
      return error.response.status;
    }
    console.error(
      `Произошла ошибка при получении и сохранении информации игры id_app_steam=${steamGame.id_app_steam}:`,
      error
    );
    err = `Произошла ошибка при получении и сохранении информации игры id_app_steam=${steamGame.id_app_steam}:`;
    return 0;
  }
}

exports.update = (req, res) => {
  const id = req.params.id;

  SteamGames.findOne({ where: { id: id, b_deleted: false } })
    .then(async (steamGame) => {
      if (steamGame) {
        let err;
        const success = await updateInfoGameSteam(steamGame, err);

        if (success === 1) {
          res.status(200).send({
            message: `Игра с id_app_steam=${steamGame.id_app_steam} успешно обновлена.`,
          });
        } else {
          res.status(500).send({
            message: err,
          });
        }
      } else {
        res.status(404).send({ message: "Игра Steam не найдена." });
      }
    })
    .catch((err) => {
      console.error("Произошла ошибка:", err.message);
      console.error("Стек вызовов:", err.stack);
      res.status(500).send({ message: "Произошла ошибка при поиске игры." });
    });
};

async function fetchAndSaveSteamGames() {
  try {
    // Выполняем GET-запрос к API Steam для получения списка всех игр
    const response = await axios.get(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
    );
    const games = response.data.applist.apps;

    // Фильтруем игры и выбираем только те, где значения name и id_app_steam не пустые
    const validGames = games.filter((game) => game.name && game.appid);

    // Разбиваем список игр на части по 1000 записей
    const chunks = _.chunk(validGames, 1000);

    // Перебираем каждую часть и сохраняем её в базе данных
    for (const chunk of chunks) {
      await db.sequelize.transaction(async (t) => {
        await Promise.all(
          chunk.map(async (game) => {
            await SteamGames.upsert(
              {
                id_app_steam: game.appid,
                name: game.name,
                b_deleted: false,
              },
              {
                transaction: t,
              }
            );
          })
        );
      });
      console.log("1000 игр успешно добавлены/обновлены");
    }

    console.log("Все игры успешно добавлен/обновлены");
  } catch (error) {
    console.error("Произошла ошибка при получении и сохранении игр:", error);
  }
}

//https://stackoverflow.com/questions/63143880/how-to-get-a-full-list-of-steam-games-only-no-dlcs-no-trailers-etc-using
// Возможно для списка всего игр лучше использовать другой метод? Вытащить только игры?
exports.updateAll = async (req, res) => {
  const settings = req.body.params.setting;

  if (settings === "list-games") {
    await fetchAndSaveSteamGames();
    res.status(200).send("Refresh");
  } else if (settings === "info") {
    let countSuccess = 0;

    // Переписать потом еще на даты, например за последний месяц обновлять, вдруг игра станет доступна? Или релиз настанет?
    const listGamesForUpdate = await sequelize.query(
      `SELECT * FROM steam_games
      WHERE b_deleted = false
      AND b_available IS NULL
      AND app_type IS NULL
      ORDER BY name
      LIMIT 200`,
      {
        type: sequelize.QueryTypes.SELECT,
        model: SteamGames, // Указываем модель
        mapToModel: true, // Включаем сопоставление -- чтобы можно было использовать update дальше, т.к. иначе у нас обычный объект JS, а не экземпляр модели Seq
      }
    );

    for (const game of listGamesForUpdate) {
      let status = await updateInfoGameSteam(game);
      if (status == 429) {
        console.log(
          `Обновлена информация о ${countSuccess} играх из ${listGamesForUpdate.length}. Too many Requests.`
        );
        res
          .status(200)
          .send(
            `Обновлена информация о ${countSuccess} играх из ${listGamesForUpdate.length}. Too many Requests.`
          );
        return;
      }
      countSuccess += status;
    }

    console.log(
      `Обновлена информация о ${countSuccess} играх из ${
        listGamesForUpdate.length
      }. ${new Date()}`
    );

    res
      .status(200)
      .send(
        `Обновлена информация о ${countSuccess} играх из ${listGamesForUpdate.length}.`
      );
  } else {
    res.status(404).send({ message: "Неизвестная команда" });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  SteamGames.update(
    { b_deleted: true },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Game was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete game with id=${id}. Maybe game was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete game with id=" + id,
      });
    });
};
