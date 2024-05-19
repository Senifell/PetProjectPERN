const express = require("express");
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem'))
};

var corsOptions = {
  origin: "https://localhost:8081"
};

// var allowedOrigins = ['https://localhost']; // Разрешенный список доменов
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };

app.use(cors(corsOptions));

app.use(express.json()); 

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

require("./app/routes/people.routes")(app);
require("./app/routes/users.routes")(app);
require("./app/routes/account.routes")(app);
require("./app/routes/list-games.routes")(app);
require("./app/routes/private-games.routes")(app);
require("./app/routes/steam-games.routes")(app);

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Таблица Account была создана (или уже существует, если force: false).');
  })
  .catch(error => {
    console.error('Ошибка при создании таблицы Account:', error);
  });

// set port, listen for requests
const PORT = process.env.PORT || 8080;

// Замена app.listen на https.createServer
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on https://localhost:${PORT}`);
});

//for start: node server.js