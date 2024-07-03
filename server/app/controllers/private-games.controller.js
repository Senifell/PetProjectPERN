const db = require("../models");
const sequelize = db.sequelize;
require("dotenv").config();
const PrivateGames = db.private_games;
const Account = db.accounts;
const Op = db.Sequelize.Op;
const axios = require("axios");

exports.create = (req, res) => {
  if (!req.body.id_user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const privateGames = {
    name: req.body.name,
    id_user: req.body.id_user,
    description: req.body.description,
    min_player: req.body.min_player,
    max_player: req.body.max_player,
    id_app_steam: req.body.id_app_steam,
    is_get: req.body.is_get,
    n_playtime: req.body.n_playtime,
    b_deleted: 0,
  };

  if (privateGames.id_app_steam) {
    PrivateGames.findOne({
      where: {
        id_app_steam: privateGames.id_app_steam,
        id_user: req.body.id_user,
        b_deleted: false,
      },
    })
      .then((data) => {
        if (data) {
          res.status(409).send({
            message: "Игра уже добавлена в личный список!",
          });
          return;
        } else {
          PrivateGames.create(privateGames)
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the game.",
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while checking the game.",
        });
      });
  } else {
    PrivateGames.create(privateGames)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the game.",
        });
      });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  PrivateGames.findOne({ where: { id: id, b_deleted: false } })
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
  const { idUser, page = 1, pageSize = 50 } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const countResult = await sequelize.query(
      `SELECT COUNT(p.id) AS count FROM private_games p 
    WHERE p.id_user = :id_user AND p.b_deleted = false`,

      {
        replacements: { id_user: idUser },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const rows = await sequelize.query(
      `SELECT p.id, COALESCE(NULLIF(p.name, ''), s.name) AS name, COALESCE(NULLIF(p.description, ''), s.short_description) AS description, 
      p.min_player, p.max_player, ROUND(p.n_playtime / 60::numeric, 1) AS n_playtime FROM private_games p 
      LEFT JOIN steam_games s ON s.id_app_steam = p.id_app_steam AND s.b_deleted = false
      WHERE p.id_user = :id_user AND p.b_deleted = false
      ORDER BY COALESCE(NULLIF(p.name, ''), s.name)
      LIMIT :limit OFFSET :offset`,
      {
        replacements: {
          id_user: idUser,
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
    console.error("Error fetching private games:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.update = (req, res) => {
  const id = req.params.id;

  console.log(req.body);

  if (id == "null") {
    const privateGames = {
      name: req.body.name,
      id_user: req.body.id_user,
      description: req.body.description,
      min_player: req.body.min_player,
      max_player: req.body.max_player,
      id_app_steam: req.body.id_app_steam,
      is_get: req.body.is_get,
      n_playtime: req.body.n_playtime,
      b_deleted: 0,
    };
    PrivateGames.create(privateGames)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Some 1 error occurred while creating the game.",
        });
      });
  } else {
    PrivateGames.findOne({ where: { id: id, b_deleted: false } })
      .then((privateGames) => {
        if (privateGames) {
          PrivateGames.update(req.body, {
            where: { id: id },
          })
            .then((num) => {
              if (num == 1) {
                res.send({
                  message: "Game was updated successfully.",
                });
              } else {
                res.send({
                  message: `Cannot update game with id=${id}. Maybe game was not found or req.body is empty!`,
                });
              }
            })
            .catch((err) => {
              console.error("Произошла ошибка:", err.message);
              console.error("Стек вызовов:", err.stack);
              res.status(500).send({
                message: "Error updating game with id=" + id,
              });
            });
        } else {
          const privateGames = {
            name: req.body.name,
            id_user: req.body.id_user,
            description: req.body.description,
            min_player: req.body.min_player,
            max_player: req.body.max_player,
            id_app_steam: req.body.id_app_steam,
            is_get: req.body.is_get,
            n_playtime: req.body.n_playtime,
            b_deleted: 0,
          };
          PrivateGames.create(privateGames)
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message: "Some 1 error occurred while creating the game.",
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Some 2 error occurred while creating the game.",
        });
      });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  PrivateGames.update(
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

exports.getSteamOwnedGames = (req, res) => {
  const idUser = req.query.idUser;

  Account.findOne({ where: { id_user: idUser, b_deleted: false } })
    .then(async (data) => {
      if (data && data.dataValues) {
        try {
          const steamId = data.dataValues.steam_id;
          console.log(steamId);

          if (!steamId) {
            return res.status(400).send({
              message: `SteamID is required!`,
            });
          }

          const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`;

          const response = await axios.get(url, {
            params: {
              key: process.env.STEAM_API_KEY,
              steamid: steamId,
              include_played_free_games: true,
            },
          });

          if (response.data.response && !response.data.response.games) {
            return res
              .status(404)
              .json({ error: "No games found for this SteamID" });
          }

          async function fetchAndSaveSteamGames(games) {
            for (const game of games) {
              try {
                const existingGame = await PrivateGames.findOne({
                  where: {
                    id_app_steam: game.appid,
                    id_user: idUser,
                    b_deleted: false,
                  },
                });

                if (existingGame) {
                  // Если запись уже существует, обновляем её
                  await existingGame.update({
                    n_playtime: game.playtime_forever,
                  });
                } else {
                  // Если запись не существует, вставляем новую запись
                  await PrivateGames.create({
                    id_app_steam: game.appid,
                    id_user: idUser,
                    n_playtime: game.playtime_forever,
                    is_get: true,
                  });
                }
              } catch (error) {
                console.error(
                  `Failed to upsert game with appid ${game.appid}:`,
                  error.message
                );
                // Пропустить текущую запись и продолжить со следующей
              }
            }
          }

          await fetchAndSaveSteamGames(response.data.response.games);
        } catch (error) {
          if (error.response) {
            // Ошибки, которые приходят от Steam API
            return res
              .status(error.response.status)
              .json({ error: error.response.statusText });
          } else {
            // Другие ошибки
            console.error("Произошла ошибка:", err.message);
            console.error("Стек вызовов:", err.stack);
            return res.status(500).json({
              error: "An error occurred while fetching data from Steam API",
            });
          }
        }
      }
    })
    .catch((err) => {
      console.error("Произошла ошибка:", err.message);
      console.error("Стек вызовов:", err.stack);
      res.status(500).send({
        message: "Error retrieving account with id=" + idUser,
      });
    });
};
