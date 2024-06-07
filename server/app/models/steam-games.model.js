module.exports = (sequelize, Sequelize) => {
  const SteamGames = sequelize.define("steam_games", {
    id_app_steam: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_free: {
      type: Sequelize.BOOLEAN,
    },
    required_age: {
      type: Sequelize.STRING, //Как там приходит?
    },
    supported_languages: {
      type: Sequelize.STRING,
    },
    short_description: {
      type: Sequelize.STRING,
    },
    categories: {
      type: Sequelize.STRING,
    },
    genres: {
      type: Sequelize.STRING,
    },
    release_date: {
      type: Sequelize.STRING, // или дату?
    },
    n_recommendation: {
      type: Sequelize.INTEGER, // или integer?
    },
    b_deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    app_type: {
      type: Sequelize.STRING,
    },
    b_available: {
      type: Sequelize.BOOLEAN,
    },
  });

  return SteamGames;
};
