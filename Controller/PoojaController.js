const PoojaDetails = require("../Model/PoojaListModel");
const User = require("../Model/userModel");
const BookPooja = require("../Model/PoojaModel");
const poojaDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const poojaData = await PoojaDetails.findOne({ poojaName: id });
    return res.status(200).json({
      success: true,
      msg: "Pooja Found",
      pooja: poojaData,
    });
  } catch (error) {
    return res.status(400).json({
      success: "False",
      msg: "Pooja not Found",
      error: error.message,
    });
  }
};
const PoojadetailsList = async (req, res) => {
  try {
    const {
      poojaName,
      description,
      significance,
      Ingredients,
      Procedure,
      sloks,
      images,
    } = req.body;
    const newPoojaDetails = new PoojaDetails({
      poojaName,
      description,
      significance,

      Ingredients,
      Procedure,
      sloks,
      images,
    });

    const savedPooja = await newPoojaDetails.save();

    return res.status(200).json({
      success: true,
      msg: "Pooja Added",
      user: savedPooja,
    });
  } catch (error) {
    return res.status(400).json({
      success: "False",
      msg: "Pooja not Added",
      error: error.message,
    });
  }
};
const book_pooja_details = async (req, res) => {
  try {
    const user = req.params.id;
    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(401).send({
        success: false,
        message: "user id is not there in user model data",
      });
    }
    const new_Pooja = new BookPooja({ ...req.body, user: user });

    await new_Pooja.save();
    return res.status(201).send({
      status: true,
      message: "user_pooja details is saved",
      new_Pooja,
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Error in pooja details",
      error,
    });
  }
};
module.exports = {
  poojaDetails,
  PoojadetailsList,
  book_pooja_details,
};
