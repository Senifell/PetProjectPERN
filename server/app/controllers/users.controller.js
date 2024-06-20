const db = require("../models");
const User = db.users;
const Account = db.accounts;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

function generateToken(user, res) {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    timestamp: Date.now(),
  }; //занести сюда время, когда токен истечет (тек. + срок действия в unix-формате)?
  const accessToken = jwt.sign(payload, process.env.GWT_ACCESS_TOKEN_KEY, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign(payload, process.env.GWT_REFRESH_TOKEN_KEY, {
    expiresIn: "7d",
  }); // Стоит ли хранить refreshToken в массиве? или в бд?

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  });

  return accessToken;
}

// Create and Save a new User
exports.create = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;

  // Проверяем наличие пользователя с таким логином или email
  User.findOne({
    where: {
      [Op.or]: [{ username: username }, { email: email }],
    },
  })
    .then((user) => {
      if (user) {
        // Пользователь с таким именем или email уже существует
        return res
          .status(400)
          .send({ message: "This username or email is already taken." });
      }

      // Пользователь с таким логином и email не существует, можно продолжать
      bcrypt.hash(req.body.password, saltRounds, (err, hashedPassword) => {
        if (err) {
          return res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        }

        const users = {
          username: username,
          email: email,
          password: hashedPassword,
        };

        User.create(users)
          .then((data) => {
            if (data && data.dataValues) {
              const userId = data.dataValues.id;
              console.log(userId);

              // Создаем пустую запись в accounts
              Account.create({ id_user: userId, b_deleted: false })
                .then((data) => {
                  console.log("Create an account for user");
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while creating the User-account.",
                  });
                });
            } else {
              console.log("Не удалось получить данные пользователя.");
            }
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while checking username and email.",
      });
    });
};

// Retrieve all User from the database.
exports.findAll = (req, res) => {
  const username = req.query.username;
  var condition = username
    ? { username: { [Op.iLike]: `%${username}%` } }
    : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all User from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} User were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all User.",
      });
    });
};

exports.logInUser = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ where: { username } })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      // Сравниваем введенный пароль с хэшем пароля из базы данных
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          return res
            .status(401)
            .send({ message: "Authentication failed (incorrect password)." });
        }

        const accessToken = generateToken(user, res);

        console.log("Токены сгенерированы! Access: ", accessToken);

        // Аутентификация успешна
        res.status(200).json({
          user: { userId: user.id, username: user.username, email: user.email },
          accessToken,
          message: "Authentication successful.",
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.logOutUser = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(404).send({ message: "Refresh Token not found." });
  }

  res.clearCookie("refreshToken");

  console.log("refreshToken удален!");

  res.sendStatus(204);
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  console.log("refresh", refreshToken);

  if (!refreshToken) {
    return res.status(403).send({
      message: "Refresh token not found.",
    });
  }

  jwt.verify(refreshToken, process.env.GWT_REFRESH_TOKEN_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    // Добавить обновление Refresh Token
    const payload = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      timestamp: Date.now(),
    };

    const accessToken = jwt.sign(payload, process.env.GWT_ACCESS_TOKEN_KEY, {
      expiresIn: "10m",
    });

    console.log("Access токен обновили! Access: ", accessToken);

    res.status(200).json({
      user,
      accessToken,
      message: "Authentication successful.",
    });
  });
};
