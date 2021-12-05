const express = require("express");

const router = express.Router();

const orderController = require("../controllers/order");

router.get("/:orderId", orderController.getOrder);
router.post("/add", orderController.addOrder);

module.exports = router;