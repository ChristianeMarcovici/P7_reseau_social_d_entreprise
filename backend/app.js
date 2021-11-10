const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");


const database = require('./models');
const userRoutes = require('./routes/user');

const app = express();

////////////////SECURITE/////////////
//problémes de CORS, securiser requêtes serveurs differents
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  app.use(helmet());
////////////////////////////////////////////

app.use(express.json());


//database.sequelize.sync();

app.use('/api/user', userRoutes);

//export pour pouvoir y accéder dans n'importe quel autre fichier
module.exports = app;