const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    advantages: { type: [String], required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    description: { type: String, required: true },
    totalOrders: { type: Number, default: 0 },
    ratings: { type: Number, min: 0, max: 5 },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
