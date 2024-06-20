const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const schedule = require("node-schedule");
const scheduleUpdateSteamGameInfo = require("./app/schedulers/updateSteamGameInfo");

const app = express();

const options = {
  key: fs.readFileSync(path.resolve(__dirname, "certs/localhost-key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost.pem")),
};

var corsOptions = {
  origin: "https://localhost:8081",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
// db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

require("./app/routes/users.routes")(app);
require("./app/routes/account.routes")(app);
require("./app/routes/list-games.routes")(app);
require("./app/routes/private-games.routes")(app);
require("./app/routes/steam-games.routes")(app);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log(
      "Таблица была создана (или уже существует, если force: false)."
    );
  })
  .catch((error) => {
    console.error("Ошибка при создании таблицы Account:", error);
  });

// const job = schedule.scheduleJob("*/5 * * * *", async () =>
//   scheduleUpdateSteamGameInfo.doUpdate()
// ); // Пока не нужно, надо переделать

// set port, listen for requests
const PORT = process.env.PORT || 8080;

// Замена app.listen на https.createServer
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on https://localhost:${PORT}`);
});

//for start: node server.js
