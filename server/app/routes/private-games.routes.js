module.exports = app => {
    const privateGames = require("../controllers/private-games.controller.js");
    const authenticateToken = require("../middleware/authenticateToken"); // Импорт middleware

  
    var router = require("express").Router();
  
    // Retrieve a single list of games with id
    router.post("/", privateGames.create);
    // Retrieve a single list of games with id
    router.get("/:id", authenticateToken, privateGames.findAll);

    // Retrieve all list of games
    router.get("/", privateGames.findAll);
    // Update a list of games with id
    router.put("/:id", privateGames.update);
        // Delete a list of games with id
    router.delete("/:id", privateGames.delete);
  
    app.use("/api/private-games", router);
  };