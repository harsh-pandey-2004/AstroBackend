const mongoose = require("mongoose");

const PanditSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
  },
  is_verified: {
    type: Number,
    default: 0,
  },
  Skills: {
    type: [String],
  },
  ProfessionalQualifications: {
    type: [String],
  },
  gender: {
    type: String,
  },
  languages: {
    type: [String],
  },
  experience: {
    type: String,
  },
  city: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
  },
  belongsTo: {
    type: String,
  },
  image: {
    type: String,
  },
  availability: {
    date: [String],
  },
  bookings: [
    {
      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookings",
      },
      date: {
        type: [String],
      },
      time: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Pandit", PanditSchema);
