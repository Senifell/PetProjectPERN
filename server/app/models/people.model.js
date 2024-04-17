module.exports = (sequelize, Sequelize) => {
  const People = sequelize.define("people", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    }
  });

  return People;
};