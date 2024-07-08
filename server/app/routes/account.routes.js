module.exports = (app) => {
  const account = require("../controllers/account.controller.js");
  const authenticateToken = require("../middleware/authenticateToken"); // Импорт middleware

  var router = require("express").Router();

  // Retrieve a single account with id
  router.post("/", authenticateToken, account.create);
  // Retrieve a single account with id
  router.get("/", authenticateToken, account.findOne);
  // Update a account with id
  router.post("/:idUser", authenticateToken, account.update);
  // Delete a account with id
  router.delete("/:idUser", authenticateToken, account.delete);

  app.use("/api/account", router);
};
