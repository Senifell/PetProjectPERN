module.exports = (app) => {
  const users = require("../controllers/users.controller.js");

  var router = require("express").Router();

  router.post("/", users.create);

  router.get("/", users.findAll);

  router.post("/auth/login", users.logInUser);

  router.post("/auth/logout", users.logOutUser);

  router.post("/auth/refresh", users.refreshToken);

  router.get("/:id", users.findOne);

  router.put("/:id", users.update);

  router.delete("/:id", users.delete);

  router.delete("/", users.deleteAll);

  app.use("/api/user", router);
};
