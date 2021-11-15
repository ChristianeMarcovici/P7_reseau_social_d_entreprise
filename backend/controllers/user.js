//import model database User
const db = require("../models");
const User = db.User;
const { Op } = require("sequelize");

//variable d'environnement pour cacher donnée
require("dotenv").config();

//securisé mot de passe
const bcrypt = require("bcrypt");

//chiffrer email RGPD
const cryptojs = require("crypto-js");

//authentification
const jwtAuth = require("../middleware/jwtAuth");
const fs = require("fs-extra");

//////////////////////////////////////////////////////////////////

///////////////////////////////////SIGNUP//////////////////////////////////////////////////////

exports.signup = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const bio = req.body.bio;

  //on crypte l'adresse email
  /* const emailCryptojs = cryptojs
    .HmacSHA256(email, `${process.env.CRYPTO_JS_KEY_EMAIL}`)
    .toString();*/
  //Vérifie la base de donnée
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
        admin: 0,
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

  /*const emailCryptojs = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTO_JS_KEY_EMAIL}`)
    .toString();*/

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
        role: user.admin,
        token: jwtAuth.generateTokenForUser(user),
      });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

//////////////////////////////UserProfile//////////////////////////
/*
Project.findAll({
  where: {
    id: {
      [Op.and]: {a: 5},           // AND (a = 5)
      [Op.or]: [{a: 5}, {a: 6}],  // (a = 5 OR a = 6)
      [Op.gt]: 6,                // id > 6
      [Op.gte]: 6,               // id >= 6
      [Op.lt]: 10,               // id < 10
      [Op.lte]: 10,              // id <= 10
      [Op.ne]: 20,               // id != 20
      [Op.between]: [6, 10],     // BETWEEN 6 AND 10
      [Op.notBetween]: [11, 15], // NOT BETWEEN 11 AND 15
      [Op.in]: [1, 2],           // IN [1, 2]
      [Op.notIn]: [1, 2],        // NOT IN [1, 2]
      [Op.like]: '%hat',         // LIKE '%hat'
      [Op.notLike]: '%hat',       // NOT LIKE '%hat'
      [Op.iLike]: '%hat',         // ILIKE '%hat' (case insensitive)  (PG only)
      [Op.notILike]: '%hat',      // NOT ILIKE '%hat'  (PG only)
      [Op.overlap]: [1, 2],       // && [1, 2] (PG array overlap operator)
      [Op.contains]: [1, 2],      // @> [1, 2] (PG array contains operator)
      [Op.contained]: [1, 2],     // <@ [1, 2] (PG array contained by operator)
      [Op.any]: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)
    },
    status: {
      [Op.not]: false           // status NOT FALSE
    }
  }
})
*/

exports.getOneUser = async (req, res) => {
  const headerAuth = req.headers["authorization"];
  const userId = jwtAuth.getUserId(headerAuth);

  if (userId < 0) {
    return res.status(400).json({ error: "wrong token" });
  }

  try {
    const user = await User.findOne({
      where: { id: userId },
    });
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

///////////////////////////////////////////////////////////////////////
exports.getAllUsers = async (req, res) => {
  const headerAuth = req.headers["authorization"];
  const userId = jwtAuth.getUserId(headerAuth);

  if (userId < 0) {
    return res.status(400).json({ error: "wrong token" });
  }

  try {
    const users = await User.findAll({
      attributes: ["id", "username", "bio", "imgProfil", "email"],
      where: { id: { [Op.ne]: 1 } },
    });

    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

///////////////////////////////////////////////////////////////////////
exports.updateProfil = async (req, res) => {
  const headerAuth = req.headers["authorization"];
  const userId = jwtAuth.getUserId(headerAuth);

  let imgProfil;

  try {
    const user = await User.findOne({
      attributes: ["id", "username", "bio", "imgProfil"],
      where: { id: userId },
    });
    console.log(user.imgProfil);
    console.log(userId.imgProfil);
    if (userId === user.id) {
      if (req.file && user.imgProfil) {
        imgProfil = `${req.protocol}://${req.get("host")}/api/images/${
          req.file.filename
        }`;

        const filename = user.imgProfil.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("image supprimé");
          }
        });
      } else if (req.file) {
        imgProfil = `${req.protocol}://${req.get("host")}/api/images/${
          req.file.filename
        }`;
      }
      if (imgProfil) {
        user.imgProfil = imgProfil;
      }
      if (req.body.bio) {
        user.bio = req.body.bio;
      } else {
        res.status(400).json({ error: error });
      }
      if (req.body.username) {
        user.username = req.body.username;
      }
      const newUser = await user.save({
        field: ["username", "bio", "imgProfil"],
      });
      res.status(200).json({
        user: newUser,
        message: "profil mis à jour !!",
      });
    } else {
      return res.status(400).json({ message: "non authorisé" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
////////////////////////////////////////////////////////////
exports.deleteUser = async (req, res) => {
  const headerAuth = req.headers["authorization"];
  const userId = jwtAuth.getUserId(headerAuth);

  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    if (user.imgProfil !== null) {
      const filename = user.imgProfil.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        User.destroy({ where: { id: userId } });
        res.status(200).json({ message: "user supprimé" });
      });
    } else {
      User.destroy({ where: { id: userId } });
      res.status(200).json({ message: "user supprimé" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
