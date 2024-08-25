const db = require("../models");
const User = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require('util');
const verifyToken = util.promisify(jwt.verify);
const { generateToken } = require("../utils/token.utils");

const USERNAME_NOT_FOUND = "USERNAME_NOT_FOUND";
const PASSWORD_FAILED = "PASSWORD_FAILED";

exports.logInUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username, b_deleted: false } });

    if (!user) {
      return res.status(404)
      .send({ 
        message: "Пользователь с данным именем не найден.", 
        code: USERNAME_NOT_FOUND 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401)
      .send({ 
        message: "Неверный пароль.", 
        code: PASSWORD_FAILED
      });
    }
    const accessToken = generateToken(user, res);

    res.status(200).json({
      user: { userId: user.id, username: user.username, email: user.email },
      accessToken,
      message: "Успешная аутентификация",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Ошибка входа",
    });
  }
};

exports.logOutUser = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    res.clearCookie("refreshToken");
  }

  res.sendStatus(204);
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).send({
      message: "Refresh token не найден.",
    });
  }

  try {
    const user = await verifyToken(refreshToken, process.env.GWT_REFRESH_TOKEN_KEY);
    const payload = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      timestamp: Date.now(),
    };

    const accessToken = jwt.sign(payload, process.env.GWT_ACCESS_TOKEN_KEY, {
      expiresIn: "10m",
    });

    res.status(200).json({
      user,
      accessToken,
      message: "Токен обновлен.",
    });
  }
  catch(err) {
    return res.sendStatus(403);
  }
};