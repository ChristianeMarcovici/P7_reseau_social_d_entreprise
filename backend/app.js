const express = require("express");

const app = express();

app.use(express.json());


//export pour pouvoir y accéder dans n'importe quel autre fichier
module.exports = app;