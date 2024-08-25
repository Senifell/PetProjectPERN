const db = require("../models");
const User = db.users;
const Account = db.accounts;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { deleteUser } = require('../services/user.service');

const USERNAME_EXISTS = "USERNAME_EXISTS";
const EMAIL_EXISTS = "EMAIL_EXISTS";

exports.create = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const dataUserByUsername = await User.findOne({
      where: {
        username: username,
      },
    });
    
    if (dataUserByUsername) {
      return res
        .status(400)
        .send({ 
          message: "Пользователь с данным именем уже существует.", 
          code: USERNAME_EXISTS 
        });
    }
    
    const dataUserByEmail = await User.findOne({
      where: {
        email: email,
      },
    });
    
    if (dataUserByEmail) {
      return res
        .status(400)
        .send({ 
          message: "Пользователь с данным e-mail уже существует.", 
          code: EMAIL_EXISTS
        });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      b_deleted: false
    });

    if (newUser) {
      await Account.create({ id_user: newUser.id, b_deleted: false });
      return res.send(newUser);
    } else {
      return res.status(500).send({
        message: "Ошибка создания пользователя.",
      });
    }
  }
  catch (err) {
    res.status(500).send({
      message: err.message || "Ошибка создания пользователя.",
    });
  }
};

exports.findAll = async (req, res) => {
  const username = req.query.username;
  const condition = username
    ? { username: { [Op.iLike]: `%${username}%` } }
    : null;

  try {
    const data = await User.findAll({ where: condition });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Ошибка поиска пользователей.",
    });
  }
};

exports.findOne = async (req, res) => {
  const idUser = req.params.id;

  try {
    const data = await User.findByPk(idUser);
    if (data) {
      res.send(data);
    }
    else {
      res.status(404).send({
        message: `Пользователь с id=${idUser} не найден.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Ошибка поиска пользователя.",
    });
  }
};

exports.update = async (req, res) => {
  const idUser = req.params.id;

  try {
    const [updated] = await User.update(req.body, {
      where: { id: idUser, b_deleted: false },
    });

    if (updated) {
      res.send({
        message: "Данные пользователя обновлены.",
      });
    } else {
      res.status(404).send({
        message: `Пользователь с id=${idUser} не найден.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || `Ошибка обновления данных пользователя id=${idUser}.`,
    });
  }
};

exports.delete = async (req, res) => {
  const idUser = req.params.idUser;

  try {
    const success = await deleteUser(idUser);

    if (success) {
      res.send({
        message: "Пользователь удален.",
      });
    } else {
      res.status(404).send({
        message: `Пользователь с id=${idUser} не найден.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || `Ошибка удаления пользователя id=${idUser}.`,
    });
  }
};
