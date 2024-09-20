const mongoose = require("mongoose");

const BookPanditModel = new mongoose.Schema({
  userName:{
    type:String,
    required:true,
  },
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
  address:{
    type:String,
    required:true,
  },
  Time: {
    type: String,
    
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
  pinCode:{
    type:String,
    required:true,
  },
 Package: {
    type: String,
    required: true,
  },
  Price: {
    type: String,
    required: true,
  },
  Rashi:{
    type:String,
  },
  Gotra:{
    type:String,
  },
  Nakshatra:{
    type:String,
  }


});

module.exports = mongoose.model("BookPandit", BookPanditModel);
