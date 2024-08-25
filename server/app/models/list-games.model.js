module.exports = (sequelize, Sequelize, Users) => {
    const ListGames = sequelize.define("list_games", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Users,
          key: "id",
        },
      },
      description: {
        type: Sequelize.STRING
      },
      b_private: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      b_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    });
  
    return ListGames;
  };