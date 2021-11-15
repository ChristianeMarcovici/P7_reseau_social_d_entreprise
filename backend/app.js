const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const database = require("./models");
const {sequelize}= require("./models/index");
const userRoutes = require("./routes/user");

const app = express();

////////////////SECURITE/////////////
//problémes de CORS, securiser requêtes serveurs differents
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(helmet());
app.use(morgan("dev"));
////////////////////////////////////////////

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database.sequelize.sync();

app.use("/api", userRoutes);

//__dirname pointe vers images qui contient les fichiers static
app.use('./images', express.static(path.join(__dirname, './images')));


const dbConnect = async function () {
  try {
    await sequelize.authenticate();
    console.log('Connection réussi');
  } catch (error) {
    console.error('connection:', error);
  }
};
dbConnect();

//export pour pouvoir y accéder dans n'importe quel autre fichier
module.exports = app;
