module.exports = app => {
  const people = require("../controllers/people.controller.js");

  var router = require("express").Router();

  // Create a new People
  router.post("/", people.create);

  // Retrieve all People
  router.get("/", people.findAll);

  // Retrieve all published People
  router.get("/published", people.findAllPublished);

  // Retrieve a single People with id
  router.get("/:id", people.findOne);

  // Update a People with id
  router.put("/:id", people.update);

  // Delete a People with id
  router.delete("/:id", people.delete);

  // Delete all People
  router.delete("/", people.deleteAll);

  app.use("/api/people", router);
};