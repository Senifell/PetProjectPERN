module.exports = (app) => {
  const privateGames = require("../controllers/private-games.controller.js");
  const authenticateToken = require("../middleware/authenticateToken"); // Импорт middleware

  var router = require("express").Router();

  // Retrieve a single list of games with id
  router.post("/", privateGames.create);
  // Retrieve a single list of games with id
  router.get("/:id", authenticateToken, privateGames.findAll);

  router.get(
    "/:id/get-steam-game",
    authenticateToken,
    privateGames.getSteamOwnedGames
  );

  // Retrieve all list of games
  router.get("/", authenticateToken, privateGames.findAll);
  // Update a list of games with id
  router.put("/:id", authenticateToken, privateGames.update);
  // Delete a list of games with id
  router.delete("/:id", authenticateToken, privateGames.delete);

  app.use("/api/private-games", router);
};
