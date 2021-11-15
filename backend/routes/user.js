const express = require("express");

const password = require("../middleware/password");
const userController = require("../controllers/user");
const profilCtrl = require("../controllers/profil");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

/////////////Router/////////////////////////////////////
const router = express.Router();

/////////////signup/////////////////////////////////////
router.post("/signup", password, userController.signup);

////////////login/////////////////////////////////////////
router.post("/login", userController.login);

////////////////////users//////////////////////////////////
router.get("/users/:id", auth, userController.getOneUser);

router.get("/users", auth, userController.getAllUsers);

router.put("/users/:id", auth, multer, userController.updateProfil);

router.delete("/users/:id", auth, userController.deleteUser);

//////////////export/////////////////////////
module.exports = router;
