const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orders: [
    {
      products: [
        {
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
        },
      ],
      price: {
        type: Number,
      },
      createAt: {
        type: Date,
      },
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
