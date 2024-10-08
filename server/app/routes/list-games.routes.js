module.exports = app => {
    const listGames = require("../controllers/list-games.controller.js");
    const authenticateToken = require("../middlewares/authenticateToken"); // Импорт middleware

  
    var router = require("express").Router();
  
    // Retrieve a single list of games with id
    router.post("/", listGames.create);
    // Retrieve a single list of games with id
    router.get("/:id", authenticateToken, listGames.findAll);

    // Retrieve all public list of games
    router.get("/", listGames.findAllPublic);
    // Update a list of games with id
    router.put("/:id", listGames.update);
        // Delete a list of games with id
    router.delete("/:id", listGames.delete);
  
    app.use("/api/list-games", router);
  };