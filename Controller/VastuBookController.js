const Vastu = require("../Model/VastuModalBook");

// Create a Vastu booking
exports.createVastuBooking = async (req, res) => {
  try {
    const vastuBooking = new Vastu(req.body);
    await vastuBooking.save();
    res.status(201).json(vastuBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all Vastu bookings
exports.getAllVastuBookings = async (req, res) => {
  try {
    const vastuBookings = await Vastu.find();
    res.status(200).json(vastuBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific Vastu booking by ID
exports.getVastuBookingById = async (req, res) => {
  try {
    const vastuBooking = await Vastu.findById(req.params.id);
    if (!vastuBooking) {
      return res.status(404).json({ message: "Vastu booking not found" });
    }
    res.status(200).json(vastuBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Vastu booking by ID
exports.updateVastuBooking = async (req, res) => {
  try {
    const vastuBooking = await Vastu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vastuBooking) {
      return res.status(404).json({ message: "Vastu booking not found" });
    }
    res.status(200).json(vastuBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Vastu booking by ID
exports.deleteVastuBooking = async (req, res) => {
  try {
    const vastuBooking = await Vastu.findByIdAndDelete(req.params.id);
    if (!vastuBooking) {
      return res.status(404).json({ message: "Vastu booking not found" });
    }
    res.status(200).json({ message: "Vastu booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
