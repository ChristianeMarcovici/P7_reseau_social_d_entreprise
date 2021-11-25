const express = require("express");



const messageCtrl = require("../controllers/message");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth")
/////////////Router/////////////////////////////////////
const router = express.Router();

router.post("/new", auth, multer, messageCtrl.createMessage);
router.get("/", auth, multer, messageCtrl.getAllMessages );
router.get("/:id", auth, multer, messageCtrl.getOneMessage);
router.delete("/:id", auth, multer, messageCtrl.deleteMessage);
router.put("/:id", auth, multer, messageCtrl.updateMessage);







//////////////export/////////////////////////
module.exports = router;