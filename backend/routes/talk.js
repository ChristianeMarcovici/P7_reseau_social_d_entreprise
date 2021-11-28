const express = require("express");

/////////////Router/////////////////////////////////////
const router = express.Router();

const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth")
const talkCtrl = require("../controllers/talk")



router.post("/new", auth, multer, talkCtrl.createATalk);
router.get('/', auth, multer, talkCtrl.getAllTalks);
router.get('/:id', auth, multer, talkCtrl.getOneTalk);
router.put("/:id", auth, multer, talkCtrl.updateTalk);
router.delete("/:id", auth, multer, talkCtrl.deleteTalk);




//////////////export/////////////////////////
module.exports = router;