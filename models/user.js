const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
