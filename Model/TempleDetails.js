const mongoose = require("mongoose");
const PanditSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    image: {
      type: String
    }
  });
const TempleDetails = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,

    },
    significance: {
        type: String,

    },
    place: {
        type: String,

    },
    img: {
        type: String,

    },
    sloks: {
        type: String,

    },
    price: {
        type: Number
    },
    relatedPooja: {
        type: [String]
    },
    famousFor: {
        type: String
    },
    pandit: {
        type: PanditSchema  // Embed the Pandit schema here
    }

});
module.exports = mongoose.model("TempleDetails", TempleDetails);