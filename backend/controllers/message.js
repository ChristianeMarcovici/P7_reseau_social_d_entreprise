const models = require("../models");

const fs = require("fs-extra");
const jwtAuth = require("../middleware/jwtAuth");

/////////////////////CREATE/////////////////////////////////////////
exports.createMessage = async (req, res) => {
  const userId = req.body.UserId;
  const title = req.body.title;
  const msg = req.body.msg;
  console.log("userId dans controller");
  console.log(userId);
  console.log("body dans controller");
  console.log(req.body);

  let imgMsg = "";

  if (title == null || msg == null) {
    return res.status(400).json({ error: error });
  }

  if (title.length <= 2 || msg.length <= 4) {
    return res.status(400).json({ error: "entrée invalide" });
  }

  try {
    const users = await models.User.findOne({
      where: { id: userId },
    });
    if (users) {
      if (req.file) {
        imgMsg = `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`;
      }
      const messages = await models.Message.create({
        title: title,
        msg: msg,
        imgMsg: imgMsg,
        UserId: users.id,
      });
      const newMessage = await messages.save({
        field: ["title", "msg", "imgMsg", "UserId"],
      });

      res.status(200).json({
        msg: newMessage,
        message: "message posté!!",
      });
    } else {
      res.status(404).json({ error: error });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
////////////////////////GET ALL/////////////////////////////////
exports.getAllMessages = async (req, res, next) => {
  const userId = req.params.id;

  if (userId < 0) {
    return res.status(400).json({ error: "wrong token" });
  }
  try {
    const allMsg = await models.Message.findAll({
      order: [["createdAt", "DESC"]],
      attributes: ["id", "title", "msg", "imgMsg"],

      //relation entre la table users
      include: [
        {
          model: models.User,
          attributes: ["username"],
        },
      ],
    });

    if (allMsg) {
      res.status(200).json(allMsg);
    } else {
      res.status(404).json({ error: "valeur null" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

//////////////////GET ONE ////////////////////////////////////
exports.getOneMessage = async (req, res) => {
  const userId = req.params.id;
  console.log("userId");
  console.log(userId);

  try {
    const msg = await models.Message.findOne({
      where: { id: userId },
    });
    res.status(200).json(msg);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
//////////////////////DELETE//////////////////////////////////////////
exports.deleteMessage = async (req, res) => {
  const headerAuth = req.headers["authorization"];
  const userId = jwtAuth.getUserId(headerAuth);
  console.log("decodé : userId");
  console.log(userId);

  try {
    const msg = await models.Message.findOne({ where: { id: req.params.id } });
    const user = await models.User.findOne({ where: { id: userId } });
    console.log(user.admin);
    if (userId == msg.UserId || user.admin == 1) {
      if (msg.imgMsg) {
        const filename = msg.imgMsg.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          models.Message.destroy({ where: { id: msg.id } });
          res.status(200).json({ message: "msg supprimé" });
        });
      } else {
        models.Message.destroy({ where: { id: msg.id } });
        res.status(200).json({ message: "msg supp" });
      }
    } else {
      res.status(400).json({ message: "msg non autorisé à supprimé" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
///////////////////////UPDATE/////////////////////
exports.updateMessage = async (req, res) => {
  const headerAuth = req.headers["authorization"];
  const userId = jwtAuth.getUserId(headerAuth);
  console.log("decodé : userId");
  console.log(userId);
  console.log(req.body);
  let newImg;

  try {
    const user = await models.User.findOne({ where: { id: userId } });
    let msg = await models.Message.findOne({
      where: { id: req.params.id },
    });

    if (userId == msg.UserId || user.admin == 1) {
      if (req.file && msg.imgMsg) {
        newImg = `${req.protocol}://${req.get("host")}/api/images/${
          req.file.filename
        }`;

        const filename = msg.imgMsg.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.log(err, "erreur ici");
          } else {
            console.log("image supprimé");
          }
        });
      } else if (req.file) {
        newImg = `${req.protocol}://${req.get("host")}/api/images/${
          req.file.filename
        }`;
      }
      if (newImg) {
        msg.imgMsg = newImg;
      }
      if (req.body.msg) {
        msg.msg = req.body.msg;
      }
    } else {
      res.status(400).json({ message: "erreur d'authenfication" });
    }
    const newMsg = await msg.save({
      field: ["msg", "imgMsg"],
    });
    res.status(200).json({ newMsg: newMsg, message: "message modifié" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
///////////////////////////////////////////////////////////////////////////////