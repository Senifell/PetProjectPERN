const db = require("../models");
const ListGames = db.list_games;
const Op = db.Sequelize.Op;

// Create and Save a new list of games
exports.create = (req, res) => {
  // Validate request
  if (!req.body.id_user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a list of games
  const listGames = {
    name: req.body.name,
    id_user: req.body.id_user,
    description: req.body.description,
    b_private: req.body.b_private,
    b_deleted: 0,
  };

  // Save list of games in the database
  ListGames.create(listGames)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the list games.",
      });
    });
};

// Find a single list of games with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  ListGames.findOne({ where: { id: id, b_deleted: false } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find list of games with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving list of games with id=" + id,
      });
    });
};

// Retrieve all People from the database.
exports.findAll = (req, res) => {
  const id = req.params.id;
  // var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  ListGames.findAll({ where: { id_user: id, b_deleted: false } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving list of games.",
      });
    });
};

// Retrieve all Public List Games from the database.
exports.findAllPublic = (req, res) => {
  ListGames.findAll({ where: { b_private: false, b_deleted: false } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving list of games.",
      });
    });
};

// Update a List of games by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  if (id == 'null') {
    console.log('1');
    // Create a list of games
    const listGames = {
      name: req.body.name,
      id_user: req.body.id_user,
      description: req.body.description,
      b_private: req.body.b_private,
      b_deleted: 0,
    };
    // Save list of games in the database
    ListGames.create(listGames)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Some 1 error occurred while creating the list of games.",
        });
      });
  }
  else {
    console.log('2');
  ListGames.findOne({ where: { id: id, b_deleted: false } })
    .then((listGames) => {
      if (listGames) {
        ListGames.update(req.body, {
          where: { id: id },
        })
          .then((num) => {
            if (num == 1) {
              res.send({
                message: "List of games was updated successfully.",
              });
            } else {
              res.send({
                message: `Cannot update list of games with id=${id}. Maybe list of games was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating list of games with id=" + id,
            });
          });
      } else {
        // Create a list of games
        const listGames = {
          id_user: req.params.id_user,
          name: req.body.name,
          // dt_create: new Date(),
          // dt_last_update: new Date(),
          description: req.body.description,
          b_private: req.body.b_private,
          b_deleted: 0,
        };
        // Save list of games in the database
        ListGames.create(listGames)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                "Some 1 error occurred while creating the list of games.",
            });
          });
      }
    })
    .catch((err) => {
      console.error("Произошла ошибка:", err.message); // Вывести сообщение об ошибке в консоль
      console.error("Стек вызовов:", err.stack); // Вывести стек вызовов в консоль

      res.status(500).send({
        message: "Some 2 error occurred while creating the list of games.",
      });
    });
  }
};

// Delete a list of games with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  ListGames.update(
    { b_deleted: true },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "List of games was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete list of games with id=${id}. Maybe list of games was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete list of games with id=" + id,
      });
    });
};
