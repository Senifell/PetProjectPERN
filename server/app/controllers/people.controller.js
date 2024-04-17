const db = require("../models");
const People = db.people;
const Op = db.Sequelize.Op;

// Create and Save a new People
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a People
  const people = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  // Save People in the database
  People.create(people)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the People."
      });
    });
};

// Retrieve all People from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  People.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving people."
      });
    });
};

// Find a single People with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  People.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find People with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving People with id=" + id
      });
    });
};

// Update a People by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  People.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "People was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update People with id=${id}. Maybe People was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating People with id=" + id
      });
    });
};

// Delete a People with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  People.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "People was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete People with id=${id}. Maybe People was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete People with id=" + id
      });
    });
};

// Delete all People from the database.
exports.deleteAll = (req, res) => {
  People.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} People were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people."
      });
    });
};

// find all published People
exports.findAllPublished = (req, res) => {
  People.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving people."
      });
    });
};