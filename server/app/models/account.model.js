module.exports = (sequelize, Sequelize, Users) => {
    const Account = sequelize.define("accounts", {
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Users,
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      picture: {
        type: Sequelize.STRING
      },
      steam_id: {
        type: Sequelize.STRING
      },
      b_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    });
  
    return Account;
  };