const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getCart = async (req, res) => {
  try {
    const cartId = req.body.cartId;
    const cart = await Cart.findOne({ _id: cartId });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.addToCart = async (req, res) => {
  try {
    const cartId = req.body.cartId;
    const productId = req.body.productId;
    const cart = await Cart.findOne({ _id: cartId });
    const product = await Product.findOne({ _id: productId });

    var productFind = false;
    cart.products.forEach((product) => {
      if (product.productId == productId) {
        product.quantity++;
        productFind = true;
      }
    });
    if (!productFind) {
      cart.products.push({
        productId: productId,
        quantity: 1,
      });
    }
    cart.price += product.price;
    await cart.save();

    res.status(201).json("Thêm thành công");
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cartId = req.body.cartId;
    const cartItemId = req.body.cartItemId;
    const price = req.body.price;

    const cart = await Cart.findOne({ _id: cartId });
    cart.products = cart.products.filter(
      (cartItem) => cartItem._id != cartItemId
    );
    cart.price -= price;
    await cart.save();
    res.status(201).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json(error);
  }
};