module.exports = app => {
    const steamGames = require("../controllers/steam-games.controller.js");
    const authenticateToken = require("../middleware/authenticateToken"); // Импорт middleware

  
    var router = require("express").Router();
  

    router.get("/:id", authenticateToken, steamGames.findAll);
    router.get("/", steamGames.findAll);

    router.get("/get-app-info/:id", steamGames.findOne);

    // Update a list of games with id
    router.put("/:id", steamGames.update);
        // Delete a list of games with id
    router.delete("/:id", steamGames.delete);
  
    app.use("/api/steam-games", router);
  };