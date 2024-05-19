module.exports = (sequelize, Sequelize) => {
    const PrivateGames = sequelize.define("private_games", {
      name: {
        type: Sequelize.STRING, allowNull: false
      },
      id_user: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      min_player: {
        type: Sequelize.INTEGER
      },
      max_player: {
        type: Sequelize.INTEGER
      },
      id_app_steam: {
        type: Sequelize.INTEGER
      },
      is_get: {
        type: Sequelize.BOOLEAN
      },
      n_playtime: {
        type: Sequelize.INTEGER
      },
      b_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  
    return PrivateGames;
  };