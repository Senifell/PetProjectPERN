module.exports = (app) => {
  const account = require("../controllers/account.controller.js");
  const authenticateToken = require("../middlewares/authenticateToken");

  var router = require("express").Router();

  router.post("/", authenticateToken, account.create);
  router.get("/", authenticateToken, account.findOne);
  router.post("/:idUser", authenticateToken, account.update);
  router.delete("/:idUser", authenticateToken, account.delete);

  app.use("/api/account", router);
};