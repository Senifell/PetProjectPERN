const db = require("../models");
const sequelize = db.sequelize;
const CollectionGames = db.collection_games;
// const PrivateGames = db.private_games;
// const ListGames = db.list_games;
// const SteamGames = db.steam_games;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  const id_list_games = req.params.id;
  const bodyData = req.body;

  console.log(bodyData);

  if (!Array.isArray(bodyData)) {
    return res.status(400).send({
      message: "Request body must be an array.",
    });
  }

  try {
    const promises = bodyData.map(async (item) => {
      const collectionGames = {
        id_list_games: id_list_games,
        id_game: item,
        b_deleted: 0,
      };

      return CollectionGames.create(collectionGames);
    });

    await Promise.all(promises);

    res.status(201).send({
      message: "Games added successfully to the collection.",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while adding the games.",
    });
  }
};

exports.getAll = (req, res) => {
  const id_list_games = req.params.id;

  sequelize
    .query(
      `SELECT cg.id, cg.id_game, cg.id_list_games, COALESCE(NULLIF(p.name, ''), s.name) AS name
      FROM collection_games cg
      JOIN private_games p ON p.id = cg.id_game AND p.b_deleted = false
      LEFT JOIN steam_games s ON s.id_app_steam = p.id_app_steam AND s.b_deleted = false
      WHERE cg.b_deleted = false AND cg.id_list_games = :id_list_games
      ORDER BY COALESCE(NULLIF(p.name, ''), s.name)`,
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
    const promises = bodyData.map(async (id) => {
      return CollectionGames.update(
        { b_deleted: true },
        { where: { id_game: id, id_list_games: id_list_games } }
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
