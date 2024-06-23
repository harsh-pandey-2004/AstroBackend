const mongoose = require("mongoose");
const PoojaDetails = new mongoose.Schema({
  poojaName: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  significance: {
    type: String,
    require: true,
  },
  Ingredients: {
    type: [String],
    require: true,
  },
  Procedure: {
    type: [Object],
    require: true,
  },
  sloks: {
    type: String,
    require: true,
  },
  images:{
    type: [String],
    require: true,
  }
});
module.exports = mongoose.model("Pooja_details_List", PoojaDetails);