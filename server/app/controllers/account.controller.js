const db = require("../models");
const Account = db.accounts;
const Op = db.Sequelize.Op;

// Create and Save a new Account
exports.create = (req, res) => {
  // Validate request
  if (!req.body.id_user) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Account
  const account = {
    id_user: req.params.id,
    name: req.body.name,
    surname: req.body.surname,
    gender: req.body.gender,
    description: req.body.description,
    picture: req.body.picture,
    b_deleted: 0,
  };

  // Save Account in the database
  Account.create(account)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Account."
      });
    });
};

// Find a single Account with an id
exports.findOne = (req, res) => {
  const id_user = req.params.id;
  Account.findOne({ where: {id_user: id_user, b_deleted: false} })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Account with id=${id_user}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Account with id=" + id_user
      });
    });
};

// Update a Account by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Account.findOne({ where: { id_user: id, b_deleted: false } })
      .then(account => {
        if (account ) {
          Account.update(req.body, {
            where: { id_user: id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Account was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Account with id=${id}. Maybe Account was not found or req.body is empty!`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Error updating Account with id=" + id
              });
            });
        } else {
          // Create a Account
          const account = {
            id_user: req.params.id,
            name: req.body.name,
            surname: req.body.surname,
            gender: req.body.gender,
            description: req.body.description,
            picture: req.body.picture,
            b_deleted: 0,
          };
          // Save Account in the database
          Account.create(account)
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              res.status(500).send({
                message: "Some 1 error occurred while creating the Account."
              });
            });
        }
      })
      .catch(err => {
        console.error('Произошла ошибка:', err.message); // Вывести сообщение об ошибке в консоль
        console.error('Стек вызовов:', err.stack); // Вывести стек вызовов в консоль
      
        res.status(500).send({
          message: "Some 2 error occurred while creating the Account."
        });
      });
  };

// Delete a Account with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Account.update({b_deleted: 1}, {
    where: { id_user: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Account was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Account with id=${id}. Maybe Account was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Account with id=" + id
      });
    });
};