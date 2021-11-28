//import model database User
const db = require("../models");
const User = db.User;

//variable d'environnement pour cacher donnée
require("dotenv").config();

//securisé mot de passe
const bcrypt = require("bcrypt");

//authentification
const jwt = require("jsonwebtoken");

///////////////////////////////////SIGNUP//////////////////////////////////////////////////////
exports.signup = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const bio = req.body.bio;
  const admin = req.body.admin;

  try {
    const user = await User.findOne({
      attributes: ["email"],
      where: { email: email },
    });

    //si champs vide
    if (email == null || password == null || username == null) {
      return res.status(400).json({ erreur: "donnée manquant" });
    }

    if (user == null) {
      //on hash le mot de passe
      const bcryptedPassword = await bcrypt.hash(password, 10);

      //on crée un nouvel utilisateur
      const newUser = await User.create({
        email: email,
        password: bcryptedPassword,
        username: username,
        bio: bio,
        admin: admin,
      });
      //si ok retourne l'identifiant nouvel utilisateur
      return res.status(201).json({ userId: newUser.id });
    } else {
      res.status(400).json({ error: "compte déjà utilisé" });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

/////////////////////////////////////////LOGIN/////////////////////////////////////
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).json({ erreur: "donnée manquant" });
  }

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé !" });
    }

    const bcryptedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!bcryptedPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect !" });
    } else {
      res.status(200).json({
        userId: user.id,
        admin: user.admin,
        token: jwt.sign({ userId: user.id }, `${process.env.JWT_KEY_TOKEN}`, {
          expiresIn: "10h",
        }),
      });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
