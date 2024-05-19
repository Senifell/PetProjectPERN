const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.people = require("./people.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);
db.accounts = require("./account.model.js")(sequelize, Sequelize);
db.list_games = require("./list-games.model.js")(sequelize, Sequelize);
db.private_games = require("./private-games.model.js")(sequelize, Sequelize);
db.steam_games = require("./steam-games.model.js")(sequelize, Sequelize);

module.exports = db;