const Shop = require("../models/shop");
const Order = require("../models/order");

exports.getDelivering = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const shop = await Shop.findOne({ _id: shopId });
    const delivering = shop.delivering;
    res.status(200).json(delivering);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.acceptProduct = async (req, res) => {
  try {
    const deliveringId = req.body.deliveringId;
    const shopId = req.body.shopId;
    const orderId = req.body.orderId;
    const shop = await Shop.findOne({ _id: shopId });
    const order = await Order.findOne({ _id: orderId });
    var orderItemId, productId;
    shop.delivering.forEach((deli) => {
      if (deli._id == deliveringId) {
        deli.status = 1;
        orderItemId = deli.orderItemId;
        productId = deli.productId;
      }
    });
    await shop.save();
    order.orders.forEach((ord) => {
      if (ord._id.toString() == orderItemId.toString()) {
        ord.products.forEach((prod) => {
          if (prod.productId.toString() == productId.toString()) {
            prod.status = 1;
          }
        });
      }
    });
    await order.save();
    res.status(200).json("Xác nhận sản phẩm");
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.declineProduct = async (req, res) => {
  try {
    const deliveringId = req.body.deliveringId;
    const shopId = req.body.shopId;
    const orderId = req.body.orderId;
    const shop = await Shop.findOne({ _id: shopId });
    const order = await Order.findOne({ _id: orderId });
    var orderItemId, productId;
    shop.delivering.forEach((deli) => {
      if (deli._id == deliveringId) {
        deli.status = 2;
        orderItemId = deli.orderItemId;
        productId = deli.productId;
      }
    });
    await shop.save();
    order.orders.forEach((ord) => {
      if (ord._id.toString() == orderItemId.toString()) {
        ord.products.forEach((prod) => {
          if (prod.productId.toString() == productId.toString()) {
            prod.status = 2;
          }
        });
      }
    });
    await order.save();
    res.status(200).json("Xác nhận thành công");
  } catch (error) {
    res.status(500).json(error);
  }
};
