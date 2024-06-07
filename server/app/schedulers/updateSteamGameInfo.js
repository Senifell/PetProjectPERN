const axios = require("axios");
const db = require("../models");
const sequelize = db.sequelize;
const SteamGames = db.steam_games;
const Op = db.Sequelize.Op;

function cleanText(text) {
  // Удаляем HTML-теги с помощью регулярного выражения, удаляем *, лишние фразы и пробелы
  let cleanedText = text.replace(/<[^>]*>/g, "");
  cleanedText = cleanedText.replace(/\*/g, "");
  cleanedText = cleanedText.replace("озвучивание доступно на этих языках", "");
  const trimmedText = cleanedText.trim();
  return trimmedText;
}

async function updateInfoGameSteam(steamGame) {
  try {
    const response = await axios.get(
      "https://store.steampowered.com/api/appdetails",
      { params: { appids: steamGame.id_app_steam, l: "russian" } }
    );
    const gameData = response.data[steamGame.id_app_steam];

    if (gameData && gameData.success) {
      const gameDetails = gameData.data;

      await steamGame.update(
        {
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
        },
        { logging: false }
      );

      console.log(
        `Обновлены данные игры id_app_steam=${steamGame.id_app_steam}.`
      );
      return 1;
    } else if (gameData && !gameData.success) {
      await steamGame.update(
        {
          b_available: gameData.success,
        },
        { logging: false }
      );
      console.log(
        `Обновлены данные игры id_app_steam=${steamGame.id_app_steam}. Игра не доступна.`
      );
      return 1;
    } else {
      console.error(
        `Не удалось получить данные об игре с id=${steamGame.id_app_steam}.`
      );
      return 0;
    }
  } catch (error) {
    if (error.response) {
      // Ошибки, которые приходят от Steam API. Отловим 429
      return error.response.status;
    }
    console.error(
      `Произошла ошибка при получении и сохранении информации игры id_app_steam=${steamGame.id_app_steam}:`,
      error
    );
    return 0;
  }
}

async function doUpdate() {
  console.log("Выполняю задачу updateSteamGameInfo");

  let countSuccess = 0;

  // Переписать потом еще на даты, например за последний месяц обновлять, вдруг игра станет доступна? Или релиз настанет?
  const listGamesForUpdate = await sequelize.query(
    `SELECT * FROM steam_games
    WHERE b_deleted = false
    AND b_available IS NULL
    AND app_type IS NULL
    ORDER BY name
    LIMIT 190`,
    {
      type: sequelize.QueryTypes.SELECT,
      model: SteamGames, // Указываем модель
      mapToModel: true, // Включаем сопоставление -- чтобы можно было использовать update дальше, т.к. иначе у нас обычный объект JS, а не экземпляр модели Seq
      logging: false,
    }
  );

  for (const game of listGamesForUpdate) {
    let status = await updateInfoGameSteam(game);
    if (status == 429) {
      console.log(
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
}

module.exports = {
  doUpdate: doUpdate,
};
