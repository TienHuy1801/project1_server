const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/delivering/:shopId", shopController.getDelivering);
router.post("/accept", shopController.acceptProduct);
router.post("/decline", shopController.declineProduct);

module.exports = router;