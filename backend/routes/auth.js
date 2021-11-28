const express = require("express");
const password = require("../middleware/password");


/////////////Router/////////////////////////////////////
const router = express.Router();

const authCtrl = require("../controllers/auth");


/////////////signup/////////////////////////////////////
router.post("/signup", password, authCtrl.signup);

////////////login/////////////////////////////////////////
router.post("/login", authCtrl.login);




//////////////export/////////////////////////
module.exports = router;