const Product = require("../models/product");
const Shop = require("../models/shop");
const User = require("../models/user");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const userId = req.body.userId;
    const user = await User.findOne({ _id: userId });
    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      shopId: user.shopId,
    });
    await product.save();

    const shop = await Shop.findOne({ _id: user.shopId });
    const productShop = shop.products;
    productShop.push(product._id);
    shop.products = productShop;
    await shop.save();

    res.status(201).json("Thêm thành công");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.editProduct = async (req, res) => {
  try {
    const productId = req.body.productId;
    const product = await Product.findOne({_id: productId});
    product.title = req.body.title;
    product.imageUrl = req.body.imageUrl;
    product.price = req.body.price;
    product.description = req.body.description;
    await product.save();

    res.status(201).json("Sửa thành công");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.body.productId;
    const product = await Product.findOne({ _id: productId });
    const shop = await Shop.findOne({ _id: product.shopId });
    const cart = await Cart.findOne({ _id: product.cartId });

    shop.products = shop.products.filter(
      (product) => product._id.toString() !== productId
    );
    await shop.save();

    if (cart) {
      cart.products = cart.products.filter(
        (product) => product._id.toString() !== productId
      );
      await cart.save();
    }
    
    await Product.deleteOne({ _id: productId });
    res.status(201).json("Xóa thành công");
  } catch (err) {
    res.status(500).json(err);
  }
};
