//SECURISE LES DONNEES
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.JWT_KEY_TOKEN}`);
    const userId = decodedToken.userId;
    const admin = decodedToken.admin;
    console.log("dans auth");
    console.log(userId);
    
  
   
    //si userId et si userId != userId
    if (req.body.userId && req.body.userId != userId) {
      return res.status(401).json({error : "user non authorisé"});
    }else if (req.body.admin && req.body.admin != admin){
      return res.status(401).json({error : "user admin non authorisé"});

    }
    else {
      console.log("token decodé");
      console.log(decodedToken);
      
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error({ message: "Invalid request!" }),
    });
  }
};
