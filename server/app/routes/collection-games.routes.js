module.exports = (app) => {
  const collectionGames = require("../controllers/collection-games.controller.js");
  const authenticateToken = require("../middleware/authenticateToken"); // Импорт middleware

  var router = require("express").Router();

  router.post("/:id", authenticateToken, collectionGames.create);

  router.get("/:id", authenticateToken, collectionGames.getAll);

  router.get("/public/:id", collectionGames.getAll);

  router.delete("/:id", authenticateToken, collectionGames.delete);

  app.use("/api/collection-games", router);
};
