const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");



const {sequelize}= require("./models/index");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const talkRoutes = require("./routes/talk");

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


/*app.post('/json',(req, res)=>{
  data = req.body;
  res.send(data);
});*/
/*app.post('/form', (req, res)=>{
  data = req.body;
  res.send(data);
});*/

//database.sequelize.sync();
app.use("/api/auth", authRoutes );
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/talks", talkRoutes);


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
