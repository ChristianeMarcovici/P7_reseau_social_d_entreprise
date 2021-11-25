//SECURISE LES DONNEES
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.JWT_KEY_TOKEN}`);
    const userId = decodedToken.userId;
    console.log("dans auth");
    console.log(userId);
    console.log("req.body auth");
    console.log(req.body);
   
    //si userId et si userId != userId
    if (req.body.userId && req.body.userId != userId) {

      console.log("user id non ok");
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error({ message: "Invalid request!" }),
    });
  }
};
