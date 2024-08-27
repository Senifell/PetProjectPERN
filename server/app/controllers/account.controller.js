const db = require("../models");
const Account = db.accounts;
const Users = db.users;
const PrivateGames = db.private_games;
const ListGames = db.list_games;
const CollectionGames = db.collection_games;
const sequelize = db.sequelize;

const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const unlinkAsync = util.promisify(fs.unlink);

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
  const userId = req.body.id_user;
  if (!userId) {
    throw new ValidationError("Ошибка получения userId");
  }

  const account = {
    id_user: userId,
    name: req.body.name,
    surname: req.body.surname,
    gender: req.body.gender,
    description: req.body.description,
    steam_id: req.body.steam_id,
    picture: req.body.picture,
    b_deleted: false,
  };

  try {
    const data = await Account.create(account);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res) => {
  const userId = req.query.idUser;

  try {
    if (!userId) {
      throw new ValidationError("Ошибка получения userId");
    }

    const dataAccount = await Account.findOne({
      where: { id_user: userId, b_deleted: false },
    });

    if (!dataAccount) {
      throw new NotFoundError(`Не удалось найти аккаунт с id=${userId}.`);
    }

    const account = dataAccount.get({ plain: true });

    if (account.picture) {
      account.picture = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${path.basename(account.picture)}`;
    }

    res.status(200).json(account);
  } catch (err) {
    next(err);
  }
};

async function deleteImageFromUploads(picture) {
  const oldPicturePath = path.join(
    __dirname,
    "../../uploads",
    path.basename(picture)
  );
  try {
    await unlinkAsync(oldPicturePath);
    console.log("Старый файл успешно удален");
  } catch (fileError) {
    console.log("Ошибка при удалении старого файла", fileError.message);
  }
}

exports.update = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log("Ошибка при загрузке файла", err.message);
      return next(new ValidationError("Ошибка при загрузке файла"));
    }

    const userId = req.params.idUser;

    if (!userId) {
      throw new ValidationError("Ошибка получения userId");
    }

    let requestData;
    try {
      requestData = JSON.parse(req.body.data);
    } catch (error) {
      return next(new ValidationError("Invalid JSON data"));
    }

    try {
      const account = await Account.findOne({
        where: { id_user: userId, b_deleted: false },
      });

      if (!account) {
        throw new NotFoundError(`Аккаунт id=${userId} не найден.`);
      }

      if (req.file && account.picture) {
        await deleteImageFromUploads(account.picture);
      }

      const updatedData = {
        name: requestData.name,
        surname: requestData.surname,
        gender: requestData.gender,
        description: requestData.description,
        steam_id: requestData.steam_id,
        picture: req.file ? `/uploads/${req.file.filename}` : account.picture,
      };

      const [updated] = await Account.update(updatedData, {
        where: { id_user: userId, b_deleted: false },
      });

      if (updated === 1) {
        res.status(200).send({ message: "Данные аккаунта успешно обновлены." });
      } else {
        throw new ValidationError(
          `Ошибка обновления данных аккаунта id=${userId}.`
        );
      }
    } catch (error) {
      next(error);
    }
  });
};

async function deleteAccount(idUser, transaction) {
  const [affectedRows] = await Account.update(
    { b_deleted: true },
    {
      where: { id_user: idUser, b_deleted: false },
      transaction,
    }
  );
  return affectedRows;
}

async function deleteUser(idUser, transaction) {
  const [affectedRows] = await Users.update(
    { b_deleted: true },
    {
      where: { id: idUser, b_deleted: false },
      transaction,
    }
  );
  return affectedRows;
}

async function deleteUserGamesAndCollection(idUser, transaction) {
  const listGames = await ListGames.findAll({
    where: { id_user: idUser, b_deleted: false },
    transaction,
  });

  for (const list of listGames) {
    await CollectionGames.update(
      { b_deleted: true },
      {
        where: { id_list_games: list.id, b_deleted: false },
        transaction,
      }
    );
  }

  await ListGames.update(
    { b_deleted: true },
    {
      where: { id_user: idUser, b_deleted: false },
      transaction,
    }
  );

  await PrivateGames.update(
    { b_deleted: true },
    {
      where: { id_user: idUser, b_deleted: false },
      transaction,
    }
  );
}

exports.delete = async (req, res) => {
  const idUser = req.params.idUser;

  if (!idUser) {
    throw new ValidationError("Ошибка получения userId");
  }

  const transaction = await sequelize.transaction();

  try {
    const accountDelete = await deleteAccount(idUser, transaction);

    if (accountDelete === 0) {
      await transaction.rollback();
      return res
        .status(404)
        .send({ message: `Ошибка удаления аккаунта, id=${idUser}.` });
    }

    await deleteUserGamesAndCollection(idUser, transaction);

    const userDelete = await deleteUser(idUser, transaction);

    if (userDelete === 0) {
      await transaction.rollback();
      return res
        .status(404)
        .send({ message: `Ошибка удаления пользователя, id=${idUser}.` });
    }

    await transaction.commit();
    res.send({ message: "Аккаунт успешно удален!" });
  } catch (err) {
    console.error(err);
    if (transaction.finished !== "commit") {
      await transaction.rollback();
    }
    res
      .status(500)
      .send({ message: `Ошибка при удалении аккаунта, id=${idUser}.` });
  }
};
