const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

router.post("/register", authController.postRegister);
router.post("/edit-profile", authController.postEditProfile);
router.post("/login", authController.postLogin);
router.post("/reset", authController.postResetRequest);
router.post("/reset/:userId", authController.postChangePassword);
router.get("/verify/:userId", authController.verifyAcc);

module.exports = router;