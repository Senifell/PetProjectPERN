module.exports = (sequelize, Sequelize, ListGames, PrivateGames) => {
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
      allowNull: false,
      references: {
        model: PrivateGames,
        key: "id",
      },
    },
    b_deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  return CollectionGames;
};
