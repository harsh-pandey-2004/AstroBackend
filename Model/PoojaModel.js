const mongoose = require("mongoose");

const bookPoojaSchema = new mongoose.Schema({
  First_name: {
    type: String,
    required: true
  },
  Last_name: {
    type: String,
    required: true 
  },

  Temple:{
    type:String,
    required:true,
  },

  Pooja:{
    type:String,
    required:true,
  },
  Gotra: {
    type: String,
    required: true
  },
  Nakshtra: {
    type: String,
    required: true
  },
  Rashi: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  bookingDate: {
    type: String,
    required: true
  },
  //date-of-pooja
  date: {
    type: String
  },

  user: {
    type: String,
    required: [true, "User id required"]
  }
});

module.exports = mongoose.model("astro_book_pooja_user", bookPoojaSchema);
