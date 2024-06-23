const mongoose = require("mongoose");

const AstroloCoucellor = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    default: 0, // 1 when user verified
  },
  Skills: {
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
  dob: {
    type: String,
  },
  email: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  talkPrice: {
    type: String,
  },
  chatPrice: {
    type: String,
  },
});

module.exports = mongoose.model("AstroloCoucellor", AstroloCoucellor);
