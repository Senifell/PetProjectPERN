module.exports = app => {
    const account = require("../controllers/account.controller.js");
    const authenticateToken = require("../middleware/authenticateToken"); // Импорт middleware

  
    var router = require("express").Router();
  
    // Retrieve a single account with id
    router.post("/", authenticateToken, account.create);
    // Retrieve a single account with id
    router.get("/:id", authenticateToken, account.findOne);
    // Update a account with id
    router.put("/:id", authenticateToken, account.update);
        // Delete a account with id
    router.delete("/:id", authenticateToken, account.delete);
  
    app.use("/api/account", router);
  };