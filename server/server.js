const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const db = require("./app/models");
const errorHandler = require('./app/middlewares/errorHandler');
const schedule = require("node-schedule");
const scheduleUpdateSteamGameInfo = require("./app/schedulers/updateSteamGameInfo");

const app = express();
const PORT = process.env.PORT || 8080;

const options = {
  key: fs.readFileSync(path.resolve(__dirname, "certs/localhost-key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost.pem")),
};
const uploadDir = path.join(__dirname, "uploads");

const corsOptions = {
  origin: "https://localhost:8081",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDir));
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

require("./app/routes/users.routes")(app);
require("./app/routes/account.routes")(app);
require("./app/routes/list-games.routes")(app);
require("./app/routes/private-games.routes")(app);
require("./app/routes/steam-games.routes")(app);
require("./app/routes/collection-games.routes")(app);
require("./app/routes/auth.routes")(app);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log(
      "Таблица была создана (или уже существует, если force: false)."
    );
  })
  .catch((error) => {
    console.error("Ошибка при создании таблицы:", error);
  });

const job = schedule.scheduleJob("*/5 * * * *", async () =>
  scheduleUpdateSteamGameInfo.doUpdate()
); // Пока не нужно, надо переделать

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on https://localhost:${PORT}`);
});

//for start: node server.js
