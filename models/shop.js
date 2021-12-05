const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shopSchema = new Schema({
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
  delivering: [
    {
      username: {
        type: String,
      },
      status: {
        type: Number,
        default: 0,
      },
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
      place: {
        type: String,
      },
      orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
      orderItemId: {
        type: Schema.Types.ObjectId,
      },
    },
  ],
});

module.exports = mongoose.model("Shop", shopSchema);
