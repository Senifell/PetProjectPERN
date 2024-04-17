module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("accounts", {
      id_user: {
        type: Sequelize.INTEGER
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
      b_deleted: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Account;
  };