//import model database User
const db = require("../models");
const User = db.User;

//variable d'environnement pour cacher donnée
require("dotenv").config();

//securisé mot de passe
const bcrypt = require("bcrypt");

//chiffrer email RGPD
const cryptojs = require("crypto-js");

//authentification
const jwt = require("jsonwebtoken");

//variable d'environnement pour cacher donnée
require("dotenv").config();
////////////signup////////////////////////////

exports.signup = (req, res, next)=>{
  const email = req.body.email;
  const password = req.body.password;

  //si champs vide
  if(email == null || password == null){
    return res.status(400).json({"erreur" : "donnée manquant"});
  }
    //on crypte l'adresse email
    const emailCryptojs = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTO_JS_KEY_EMAIL}`)
    .toString();
  //Vérifie la base de donnée
  User.findOne({
    attributes: ['email'],
    where: {email: emailCryptojs}
  })

  .then(function(userFound){
    //si l'user n'existe pas
    if(!userFound){

    

      //on hash le mdp
     bcrypt.hash(password, 5, function(err, bcryptedPassword){

      //on crée un nouvel utilisateur

    const newUser = User.create({
    email: emailCryptojs,
    password: bcryptedPassword,
    admin: 0
  })

  .then(function(newUser){
    //si ok retourne l'identifiant nouvel utilisateur
    return res.status(201).json({'userId': newUser.id})
  })
  .catch(function(err){
    return res.status(500).json({'error': 'utilisateur ne peut pas être ajouté'});
  });

});
    }else{
      //erreur 409 erreur conflit, si l'user existe déjà
      return res.status(409).json({'error': 'utilisateur existe déjà'})
    }
  })
 
  .catch((error) =>
    res.status(400).json({message: "erreur ici"})
  );
}

  ///////login/////////////////////
  exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(email == null || password == null){
      return res.status(400).json({"erreur" : "donnée manquant"});
    }

    const emailCryptojs = cryptojs
      .HmacSHA256(req.body.email, `${process.env.CRYPTO_JS_KEY_EMAIL}`)
      .toString();
  
    User.findOne({where: { email: emailCryptojs }})
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
            
              return res
                .status(401)
                .json({ message: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user.id,
              role: user.admin,
              token: jwt.sign(
                { userId: user.id }, //user visible
                `${process.env.JWT_KEY_TOKEN}`, //user crypter
                { expiresIn: "10h" } //délai
              ),
            });
          })
          .catch((error) => res.status(500).json({ message: "error catch" }));
      })
      .catch((error) => res.status(500).json({ message: "error catch" }));
  };
  