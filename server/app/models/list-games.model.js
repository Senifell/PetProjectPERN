module.exports = (sequelize, Sequelize) => {
    const ListGames = sequelize.define("list_games", {
      name: {
        type: Sequelize.STRING
      },
      id_user: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      b_private : {
        type: Sequelize.BOOLEAN
      },
      b_deleted: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return ListGames;
  };