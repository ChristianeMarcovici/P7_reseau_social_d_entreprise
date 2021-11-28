const express = require("express");


const userController = require("../controllers/user");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

/////////////Router/////////////////////////////////////
const router = express.Router();

////////////////////users//////////////////////////////////
router.get("/users/:id", auth, userController.getOneUser);

router.get("/users", auth, userController.getAllUsers);

router.put("/users/:id", auth,  multer, userController.updateProfil);

router.delete("/users/:id", auth, multer, userController.deleteUser);

//////////////export/////////////////////////
module.exports = router;
