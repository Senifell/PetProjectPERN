const db = require("../models");
const Account = db.accounts;
const User = db.users;
const PrivateGames = db.private_games;
const ListGames = db.list_games;
const CollectionGames = db.collection_games;
const sequelize = db.sequelize;

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const listGamesModel = require("../models/list-games.model");

// Настройка места хранения загруженных изображений
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("avatar");

exports.create = async (req, res) => {
  if (!req.body.id_user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const account = {
    id_user: req.body.id_user,
    name: req.body.name,
    surname: req.body.surname,
    gender: req.body.gender,
    description: req.body.description,
    steam_id: req.body.steam_id,
    picture: req.body.picture,
    b_deleted: 0,
  };

  try {
    const data = await Account.create(account);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Ошибка создания аккаунта",
    });
  }
};

exports.findOne = async (req, res) => {
  const userId = req.query.idUser;

  try {
    const dataAccount = await Account.findOne({ where: { id_user: userId, b_deleted: false } });

    if (dataAccount) {
      const account = dataAccount.get({ plain: true });

      if (account.picture) {
        account.picture = `${req.protocol}://${req.get("host")}/uploads/${path.basename(account.picture)}`;
      }

      res.status(200).json(account);
    } else {
      res.status(404).json({
        message: `Аккаунт с id=${userId} не найден.`,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || `Ошибка получения аккаунта с id=${userId}.`,
    });
  }
};

exports.update = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.log("Ошибка при загрузке файла", err.message);
      return res
        .status(500)
        .send({ message: "Ошибка при загрузке файла", error: err });
    }

    const idUser = req.params.idUser;

    let requestData;
    try {
      requestData = JSON.parse(req.body.data);
    } catch (e) {
      return res.status(400).send({ message: "Invalid JSON data" });
    }

    try {
      const account = await Account.findOne({
        where: { id_user: idUser, b_deleted: false },
      });

      if (account) {
        let oldPictureUrl = account.picture;
        let oldPicture = oldPictureUrl ? path.basename(oldPictureUrl) : null;

        if (req.file && oldPicture) {
          const oldPicturePath = path.join(
            __dirname,
            "../../uploads",
            oldPicture
          );
          fs.unlink(oldPicturePath, (err) => {
            if (err) {
              console.log("Ошибка при удалении старого файла", err.message);
            } else {
              console.log("Старый файл успешно удален");
            }
          });
        }

        const updatedData = {
          name: requestData.name,
          surname: requestData.surname,
          gender: requestData.gender,
          description: requestData.description,
          steam_id: requestData.steam_id,
          picture: req.file ? req.file.filename : requestData.picture,
        };

        const num = await Account.update(updatedData, {
          where: { id_user: idUser, b_deleted: false },
        });

        if (num == 1) {
          res.send({
            message: "Account was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Account with id=${idUser}. Maybe Account was not found or req.body is empty!`,
          });
        }
      } else {
        res.status(404).send({
          message: `Cannot find Account with id=${idUser}.`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: "Error updating Account with id=" + idUser,
      });
    }
  });
};

// Delete a Account with the specified id in the request
exports.delete = async (req, res) => {
  const idUser = req.params.idUser;

  const t = await sequelize.transaction();

  try {
    const accountResult = await Account.update(
      { b_deleted: true },
      {
        where: { id_user: idUser, b_deleted: false },
        transaction: t,
      }
    );

    if (accountResult[0] === 1) {
      const listGames = await ListGames.findAll({
        where: { id_user: idUser, b_deleted: false },
        transaction: t,
      });

      for (const list of listGames) {
        await CollectionGames.update(
          { b_deleted: true },
          {
            where: { id_list_games: list.id, b_deleted: false },
            transaction: t,
          }
        );
      }

      await ListGames.update(
        { b_deleted: true },
        {
          where: { id_user: idUser, b_deleted: false },
          transaction: t,
        }
      );

      await PrivateGames.update(
        { b_deleted: true },
        {
          where: { id_user: idUser, b_deleted: false },
          transaction: t,
        }
      );

      const userResult = await User.update(
        { b_deleted: true },
        {
          where: { id: idUser, b_deleted: false },
          transaction: t,
        }
      );

      if (userResult[0] === 1) {
        // Фиксация транзакции, если все операции успешны
        await t.commit();
        res.send({
          message: "Аккаунт успешно удален!",
        });
      } else {
        // Откат транзакции, если удаление пользователя не удалось
        await t.rollback();
        res.send({
          message: `Ошибка удаления пользователя, id=${idUser}.`,
        });
      }
    } else {
      // Откат транзакции, если удаление аккаунта не удалось
      await t.rollback();
      res.send({
        message: `Ошибка удаления аккаунта, id=${idUser}.`,
      });
    }
  } catch (err) {
    await t.rollback();
    res.status(500).send({
      message: `Ошибка при удалении аккаунта, id=${idUser}.`,
    });
  }
};
