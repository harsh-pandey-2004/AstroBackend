const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
  },
  gender: {
    type: String,
  },
  Dob: {
    type: String,
  },
  Placeofbirth: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: String,
  },
  Tobirth: {
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
  otpExpiration: {
    type: Date,
    default: Date.now,
    get: (otpExpiration) => otpExpiration.getTime(),
    set: (otpExpiration) => new Date(otpExpiration),
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  is_verified: {
    type: Number,
    default: 0, // 1 when user verified
  },
  created_date: {
    type: String,
  },
  created_by: {
    type: String,
  },
  updated_date: {
    type: String,
  },
  updated_by: {
    type: String,
  },
  pooja: [
    {
      type: mongoose.Types.ObjectId,
      ref: "astro_book_pooja_user",
    },
  ],
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

module.exports = mongoose.model("astrocaptain_user", userSchema);
