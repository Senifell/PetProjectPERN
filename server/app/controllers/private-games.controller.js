const db = require("../models");
const PrivateGames = db.private_games;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
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

  // Save in the database
  PrivateGames.create(privateGames)
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

// Retrieve all People from the database.
exports.findAll = (req, res) => {
  const id = req.params.id;
  console.log(id);
  // var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  PrivateGames.findAll({ where: { id_user: id, b_deleted: false } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving game.",
      });
    });
};

// Update a List of games by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  console.log(id);
  if (id == "null") {
    // Create
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
    // Save in the database
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
              res.status(500).send({
                message: "Error updating game with id=" + id,
              });
            });
        } else {
          // Create
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
          // Save in the database
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
        console.error("Произошла ошибка:", err.message); // Вывести сообщение об ошибке в консоль
        console.error("Стек вызовов:", err.stack); // Вывести стек вызовов в консоль

        res.status(500).send({
          message: "Some 2 error occurred while creating the game.",
        });
      });
  }
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  PrivateGames.update(
    { b_deleted: 1 },
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
