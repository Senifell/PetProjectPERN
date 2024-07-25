const db = require("../models");
const sequelize = db.sequelize;
const CollectionGames = db.collection_games;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  const id_list_games = req.params.id;
  const bodyData = req.body;

  if (!Array.isArray(bodyData)) {
    return res.status(400).send({
      message: "Request body must be an array.",
    });
  }

  try {
    const promises = bodyData.map(async (item) => {
      const collectionGames = {
        id_list_games: id_list_games,
        id_game: item.id_game || null,
        id_steam_game: item.id_steam_game || null,
        name_custom_game:
          !item.id_game && !item.id_steam_game ? item.name : null,
        b_deleted: 0,
      };

      try {
        return await CollectionGames.create(collectionGames);
      } catch (err) {
        console.error(
          `Error creating collection game for item ${JSON.stringify(item)}:`,
          err
        );
        throw err;
      }
    });

    await Promise.all(promises);

    res.status(201).send({
      message: "Games added successfully to the collection.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while adding the games.",
    });
  }
};

exports.getAll = (req, res) => {
  const id_list_games = req.params.id;

  sequelize
    .query(
      `SELECT cg.id, cg.id_list_games, cg.id_game, cg.id_steam_game, 
              COALESCE(NULLIF(p.name, ''), s.name) AS name
      FROM collection_games cg
      JOIN private_games p ON p.id = cg.id_game AND p.b_deleted = false
      LEFT JOIN steam_games s ON s.id_app_steam = p.id_app_steam AND s.b_deleted = false
      WHERE cg.b_deleted = false AND cg.id_list_games = :id_list_games

      UNION ALL

      SELECT cg.id, cg.id_list_games, cg.id_game, cg.id_steam_game, 
             NULLIF(sg.name, '') AS name
      FROM collection_games cg
      JOIN steam_games sg ON sg.id_app_steam = cg.id_steam_game AND sg.b_deleted = false
      WHERE cg.b_deleted = false AND cg.id_list_games = :id_list_games

      UNION ALL

      SELECT cg.id, cg.id_list_games, cg.id_game, cg.id_steam_game, 
             NULLIF(cg.name_custom_game, '') AS name
      FROM collection_games cg
      WHERE cg.b_deleted = false AND cg.id_list_games = :id_list_games
      AND cg.id_game IS NULL AND cg.id_steam_game IS NULL

      ORDER BY name`,
      {
        replacements: { id_list_games: id_list_games },
        type: sequelize.QueryTypes.SELECT,
      }
    )
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || "Some error occurred while retrieving game.",
      });
    });
};

exports.delete = async (req, res) => {
  const id_list_games = req.params.id;
  const bodyData = req.query.data;

  if (!Array.isArray(bodyData)) {
    return res.status(400).send({
      message: "Request body must be an array of IDs.",
    });
  }

  try {
    const promises = bodyData.map(async (item) => {
      return CollectionGames.update(
        { b_deleted: true },
        {
          where: {
            id: item.id,
            id_game: item.id_game || null,
            id_steam_game: item.id_steam_game || null,
            id_list_games: id_list_games,
          },
        }
      );
    });

    const results = await Promise.all(promises);

    const notFoundIds = [];
    results.forEach((result, index) => {
      if (result[0] !== 1) {
        notFoundIds.push(bodyData[index]);
      }
    });

    if (notFoundIds.length > 0) {
      res.status(207).send({
        message: `Some games were not found or could not be deleted.`,
      });
    } else {
      res.send({
        message: "All games in collection were deleted successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while deleting the games.",
    });
  }
};
