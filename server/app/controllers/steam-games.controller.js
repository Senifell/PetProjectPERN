const axios = require('axios');
const db = require("../models");
const SteamGames = db.steam_games;
const Op = db.Sequelize.Op;
const _ = require('lodash');

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
  };

  // Save in the database
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
  const { userId, refresh, page = 1, pageSize = 50, search = "" } = req.query;
  const offset = (page - 1) * pageSize;
  console.log(refresh);

  if (refresh === 'true') {
    // Стим, получение всего списка игр (id, name), пропускаем пустые, в идеале выцепить только игры
    async function fetchAndSaveSteamGames() {
      try {
        // Выполняем GET-запрос к API Steam для получения списка всех игр
        const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
        const games = response.data.applist.apps;

        // Фильтруем игры и выбираем только те, где значения name и id_app_steam не пустые
        const validGames = games.filter(game => game.name && game.appid);

        // Разбиваем список игр на части по 1000 записей
        const chunks = _.chunk(validGames, 1000);

        // Перебираем каждую часть и сохраняем её в базе данных
        for (const chunk of chunks) {
          await db.sequelize.transaction(async (t) => {
            await Promise.all(chunk.map(async (game) => {
              await SteamGames.upsert({
                id_app_steam: game.appid,
                name: game.name,
                b_deleted: false
              }, {
                transaction: t
              });
            }));
          });
          console.log('1000 игр успешно добавлены в базу данных.');
        }

        console.log('Все игры успешно добавлены в базу данных.');
      } catch (error) {
        console.error('Произошла ошибка при получении и сохранении игр:', error);
      }
    }

    // Вызываем функцию для получения и сохранения игр
    await fetchAndSaveSteamGames();
    res.status(200).send('Refresh started');
  } else {
    const where = {
      b_deleted: false,
      [Op.or]: [
        { app_type: "game" },
        { app_type: { [Op.is]: null } }
      ],
      ...(search && { name: { [Op.iLike]: `%${search}%` } })
    };

    SteamGames.findAndCountAll({
      where,
      limit: parseInt(pageSize, 10),
      offset: parseInt(offset, 10)
    })
    .then(result => {
      const { count, rows } = result;

      res.send({
        totalItems: count,
        items: rows,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page
      });
    })
    .catch(error => {
      console.error('Error fetching steam games:', error);
      res.status(500).send('Internal Server Error');
    });
  }
};


function cleanText(text) {
    // Удаляем HTML-теги с помощью регулярного выражения
    const cleanedText = text.replace(/<[^>]*>/g, '');
    // Удаляем лишние пробелы и переносы строк
    const trimmedText = cleanedText.trim();
    return trimmedText;
}

exports.update = (req, res) => {
  const id = req.params.id;

  SteamGames.findOne({ where: { id: id, b_deleted: false } })
    .then(async (steamGame) => {
      if (steamGame) {
        try {
          // Полная информация об игре Steam
          const response = await axios.get('https://store.steampowered.com/api/appdetails', { params: { appids: steamGame.id_app_steam } });
          const gameData = response.data[steamGame.id_app_steam];

          if (gameData && gameData.success) {
            const gameDetails = gameData.data;

            // Обновление записи в базе данных
            await steamGame.update({
              name: gameDetails.name,
              is_free: gameDetails.is_free,
              required_age: gameDetails.required_age,
              supported_languages: gameDetails.supported_languages ? cleanText(gameDetails.supported_languages) : null,
              short_description: gameDetails.short_description,
              categories: gameDetails.categories ? gameDetails.categories.map(category => category.description).join(', ') : null,
              genres: gameDetails.genres ? gameDetails.genres.map(genre => genre.description).join(', ') : null,
              release_date: gameDetails.release_date ? gameDetails.release_date.date : null,
              n_recommendation: gameDetails.recommendations ? gameDetails.recommendations.total : null,
              app_type: gameDetails.type,
              
              b_deleted: false // Предполагаю, что вы не хотите устанавливать это вручную при обновлении
            });

            console.log(`Обновлены данные игры id=${id}.`);
            res.status(200).send({ message: `Игра с id=${id} успешно обновлена.` });
          } else {
            console.error(`Не удалось получить данные об игре с id=${steamGame.id_app_steam}.`);
            res.status(500).send({ message: `Не удалось получить данные об игре с id=${steamGame.id_app_steam}.` });
          }
        } catch (error) {
          console.error(`Произошла ошибка при получении и сохранении информации игры id=${id}:`, error);
          res.status(500).send({ message: `Произошла ошибка при получении и сохранении информации игры id=${id}.` });
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


// Delete with the specified id in the request
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
