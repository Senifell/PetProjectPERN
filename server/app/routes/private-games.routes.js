module.exports = (app) => {
  const privateGames = require("../controllers/private-games.controller.js");
  const authenticateToken = require("../middlewares/authenticateToken");

  var router = require("express").Router();

  router.post("/", privateGames.create);
  router.get("/:id", authenticateToken, privateGames.findAll);
  router.get("/", authenticateToken, privateGames.findAll);
  router.put("/:id", authenticateToken, privateGames.update);
  router.delete("/:id", authenticateToken, privateGames.delete);

  router.get(
    "/:id/get-steam-game",
    authenticateToken,
    privateGames.getSteamOwnedGames
  );

  app.use("/api/private-games", router);
};
