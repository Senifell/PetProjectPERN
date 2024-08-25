module.exports = (app) => {
    const auth = require("../controllers/auth.controller.js");
  
    var router = require("express").Router();
  
    router.post("/auth/login", auth.logInUser);
  
    router.post("/auth/logout", auth.logOutUser);
  
    router.post("/auth/refresh", auth.refreshToken);
  
    app.use("/api/user", router);
  };
  