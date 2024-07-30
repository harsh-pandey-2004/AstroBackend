const Vastu = require("../Model/VastuModel");

// Function to get Vastu data by name
const getVastuByName = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(name);

    // Find the Vastu data by name in all categories
    const vastuData = await Vastu.find({ "type": name });

    if (!vastuData || vastuData.length === 0) {
      return res.status(404).json({ message: "Vastu data not found" });
    }

    res.status(200).json(vastuData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Function to create new Vastu data
const createVastu = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type || !Array.isArray(type) || type.length === 0) {
      return res.status(400).json({ message: "Type array with at least one element is required" });
    }

    // Create a new Vastu document
    const newVastu = new Vastu({ type });

    // Save the new Vastu document to the database
    const savedVastu = await newVastu.save();

    res.status(201).json(savedVastu);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getVastuByName,
  createVastu,
};
