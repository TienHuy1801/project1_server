const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/product");
const Shop = require("../models/shop");
const User = require("../models/user");

exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({ _id: orderId });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.addOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findOne({ _id: userId });
    const cart = await Cart.findOne({ _id: user.cartId });
    const order = await Order.findOne({ _id: user.orderId });
    order.orders.push({
      products: cart.products,
      price: cart.price,
      createAt: Date.now(),
    });
    await order.save();
    const itemId = order.orders[order.orders.length-1]._id;
    cart.products.forEach(async (prod) => {
      const product = await Product.findOne(prod.productId);
      const shop = await Shop.findOne(product.shopId);
      shop.delivering.push({
        username: user.fullName,
        place: user.place,
        productId: prod.productId,
        quantity: prod.quantity,
        orderId: user.orderId,
        orderItemId: itemId
      }) 
      await shop.save();
    })
    cart.products = [];
    cart.price = 0;
    await cart.save();
    res.status(201).json({ message: "Đặt hàng thành công" });
  } catch (error) {
    res.status(500).json(error);
  }
};
