const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cart");

router.post("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.post("/remove", cartController.removeFromCart);

module.exports = router;