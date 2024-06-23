const mongoose = require("mongoose");

const BookPanditModel = new mongoose.Schema({
  poojaName: {
    type: String,
    required: true,
  },
  panditName: {
    type: String,
    required: true ,
  },
  Day: {
    type: String,
    required: true,
  },
  Time: {
    type: String,
    required: true,
  },
  PanditId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PanditBookedId",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserBookingId",
    required: true,
  },
  MaterialRequired: {
    type: Boolean,
    required: true,
  },
  TotalPrice: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("BookPandit", BookPanditModel);
