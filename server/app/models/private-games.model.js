module.exports = (sequelize, Sequelize, SteamGames, Users) => {
  const PrivateGames = sequelize.define(
    "private_games",
    {
      name: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
      },
      min_player: {
        type: Sequelize.INTEGER,
      },
      max_player: {
        type: Sequelize.INTEGER,
      },
      id_app_steam: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: SteamGames,
          key: "id_app_steam",
        },
      },
      is_get: {
        type: Sequelize.BOOLEAN,
      },
      n_playtime: {
        type: Sequelize.INTEGER,
      },
      b_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }
    // },
    // {
    //   indexes: [
    //     {
    //       unique: true,
    //       fields: ["id_app_steam", "id_user"],
    //       where: { id_app_steam: { [Sequelize.Op.ne]: null } }, // Использовать условие для уникального ограничения
    //     },
    //   ],
    // }
  );

  return PrivateGames;
};
