//import model database User
const db = require("../models");
const User = db.User;
//parametre de recherche sequelize
const { Op } = require("sequelize");

//variable d'environnement pour cacher donnée
require("dotenv").config();

//authentification
const jwtAuth = require("../middleware/jwtAuth");
const fs = require("fs-extra");

//////////////////////////////UserProfile//////////////////////////
exports.getOneUser = async (req, res) => {
  const userId = req.params.id;

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
  const userId = req.params.id;

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
  const userId = jwtAuth.getUserId(req.headers["authorization"]);
  const userProfil = req.params.id;

  let imgProfil;

  try {
    const user = await User.findOne({
      attributes: ["id", "username", "bio", "imgProfil"],
      where: { id: userProfil },
    });
    const admin = await User.findOne({ where: { id: userId } });

    if (userId == userProfil || admin.admin == 1) {
      console.log("userId");
      console.log(userId);
      if (req.file) {
        imgProfil = `${req.protocol}://${req.get("host")}/api/images/${
          req.file.filename
        }`;

        if (user.imgProfil) {
          const filename = user.imgProfil.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("image supprimé");
            }
          });
        }
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
  const userId = jwtAuth.getUserId(req.headers["authorization"]);
  const userProfil = req.params.id;

  try {
    const user = await User.findOne({
      where: { id: userProfil },
    });
    const admin = await User.findOne({ where: { id: userId } });

    if (userId == userProfil || admin.admin == 1) {
      if (user.imgProfil !== null) {
        const filename = user.imgProfil.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          user.destroy({ where: { id: userProfil } });
          res.status(200).json({ message: "user supprimé" });
        });
      } else {
        user.destroy({ where: { id: userProfil } });
        res.status(200).json({ message: "user supprimé" });
      }
    } else {
      return res.status(400).json({ message: "non authorisé" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
///////////////////////////////////////////////////////////////
