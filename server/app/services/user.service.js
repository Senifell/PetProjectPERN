const User = require('../models/users.model.js');

async function deleteUser(idUser) {
  try {
    const [updated] = await User.update({ b_deleted: true }, {
      where: { id: idUser, b_deleted: false },
    });
    return updated > 0;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { deleteUser };
