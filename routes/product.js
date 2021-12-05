const express = require("express");

const router = express.Router();

const productController = require("../controllers/product");

router.get("/", productController.getProducts);
router.post("/add-product", productController.addProduct);
router.post("/delete-product", productController.deleteProduct);
router.post("/edit-product", productController.editProduct);

module.exports = router;