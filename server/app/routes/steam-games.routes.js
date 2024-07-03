module.exports = (app) => {
  const steamGames = require("../controllers/steam-games.controller.js");
  const authenticateToken = require("../middleware/authenticateToken");

  var router = require("express").Router();

  router.get("/:id", authenticateToken, steamGames.findAll);
  // router.get("/", steamGames.findAll); //?

  router.get("/get-app-info/:id", steamGames.findOne);

  // Update all list games (setting = 'list-games') or update info about all games (setting = 'info')
  // Mb only 'game' app or 'game' and 'dlc' app?
  router.put("/update", authenticateToken, steamGames.updateAll);

  // Update a list of games with id
  router.put("/:id", steamGames.update);

  // Delete a list of games with id
  router.delete("/:id", steamGames.delete);

  app.use("/api/steam-games", router);
};
