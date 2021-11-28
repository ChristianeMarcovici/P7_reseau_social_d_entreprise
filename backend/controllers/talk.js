const models = require("../models");

const fs = require("fs-extra");
const jwtAuth = require("../middleware/jwtAuth");

/////////////////////create////////////////////////////////////
exports.createATalk = async (req, res) => {
  const headerAuth = req.headers["authorization"];
  const userId = jwtAuth.getUserId(headerAuth);
  console.log("decodé : userId");
  console.log(userId);
  let imgTalk;
  try {
    const user = await models.User.findOne({
      where: { id: userId },
      //relation entre la table users
      include: [
        {
          model: models.User,
          attributes: ["username"],
        },
      ],
    });

    if (user) {
      if (req.file) {
        imgTalk = `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`;
      } else {
        imgTalk = null;
      }

      const talk = await models.Talk.create({
        UserId: req.body.UserId,
        MessageId: req.body.MessageId,
        msgTalk: req.body.msgTalk,
        imgTalk: imgTalk,
      });
      const newTalk = await talk.save({
        field: ["UserId","MessageId", "msgTalk", "imgTalk" ],
      });

     return res.status(201).json({talk: newTalk.id, message: "nouveau commentaire" });
    }else {
       return res.status(404).json({ error: error });
      }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

/////////////////////////////////////////////////////////////////////////////////
exports.getAllTalks = async (req, res) =>{

  try{
    const allTalks = await models.Talk.findAll();

    if(allTalks <= 0){
      return res.status(404).json("commentaire non trouvé");
    }
    res.status(200).json(allTalks)

  }catch (error) {
    return res.status(500).json({ error: error });
  }

}
/////////////////////////////////////////////////////////////////////////
exports.getOneTalk = async (req, res) =>{
  try{
    const oneTalk = await models.Talk.findOne({
      where: {id: req.params.id}
    });
    res.status(200).json(oneTalk);

  }catch (error) {
    return res.status(500).json({ error: error });
  }
 
}

///////////////////////////////////////////////////////////////////
exports.updateTalk = async (req, res)=>{
  const userId = jwtAuth.getUserId(req.headers["authorization"]);
  let newImg;
  try{
    const talk = await models.Talk.findOne({
      where: {id: req.params.id}
    });
    const user = await models.User.findOne({
      where: {id: userId}
    });

    if(userId == talk.UserId || user.admin == 1){
      if(req.file){
        newImg = `${req.protocol}://${req.get("host")}/api/images/${
          req.file.filename
        }`;
        if(talk.imgTalk){
          const filename = talk.imgTalk.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.log(err, "erreur ici");
            } else {
              console.log("image supprimé");
            }
          });
        }
      }
      if(newImg){
        talk.imgTalk = newImg;
      }
      if(req.body.msgTalk){
        talk.msgTalk = req.body.msgTalk;
      }
    }else {
      return res.status(400).json({ message: "erreur d'authenfication" });
    }
    const newTalk = await talk.save({
      field: ["msgTalk", "imgTalk"],
    });
    res.status(200).json({ newTalk: newTalk, message: "message modifié" });


  }catch (error) {
    return res.status(500).json({ error: error });
  }
}

///////////////////////////////////////////////////////////////////////
exports.deleteTalk = async (req, res)=>{
  const userId = jwtAuth.getUserId(req.headers["authorization"]);
  try{
    const talk = await models.Talk.findOne({
      where: {id: req.params.id}
    });
    const user = await models.User.findOne({
      where: {id: userId}
    });

    if(userId == talk.UserId || user.admin == 1) {
      if(talk.imgTalk){
        const filename = talk.imgTalk.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          models.Talk.destroy({ where: { id: talk.id } });
          res.status(200).json({ message: "msg supprimé" });
        });
      }else {
        models.Talk.destroy({ where: { id: talk.id } });
        res.status(200).json({ message: "msg supp" });
      }
    }else {
      return res.status(400).json({ message: "utilisateur non autorisé à supprimé" });
    }

  }catch (error) {
    return res.status(500).json({ error: error });
  }
}