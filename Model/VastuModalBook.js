const mongoose = require("mongoose");

const VastuBookingSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  ownerDob: {
    type: Date,
    required: true,
  },
  plotAddress: {
    type: String,
    required: true,
  },
  boundaryWalls: {
    type: Boolean,
    required: true,
  },
  nearbyStructure: {
    type: String, // This will store the file path as a string
    required: true,
  },
  additionalInfo: {
    type: String,
  },
  plotSize: {
    type: String,
    required: true,
  },
  facingDirection: {
    type: String,
    required: true,
  },
  mainDoor: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // This will store an array of file paths
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("VastuBooking", VastuBookingSchema);
