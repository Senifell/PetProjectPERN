module.exports = (
  sequelize,
  Sequelize,
  ListGames,
  PrivateGames,
  SteamGames
) => {
  const CollectionGames = sequelize.define("collection_games", {
    id_list_games: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: ListGames,
        key: "id",
      },
    },
    id_game: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: PrivateGames,
        key: "id",
      },
    },
    id_steam_game: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: SteamGames,
        key: "id_app_steam",
      },
    },
    name_custom_game: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    b_deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  return CollectionGames;
};
