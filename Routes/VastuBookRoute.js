const express = require("express");
const router = express.Router();
const vastuBookingController = require("../Controller/VastuBookController");

// Routes
router.post("/createvastubook", vastuBookingController.createVastuBooking);
router.get("/getvastubookdetails", vastuBookingController.getAllVastuBookings);
router.get("/getvastubookdetails/:id", vastuBookingController.getVastuBookingById);
router.put("/updatevastubookdetails/:id", vastuBookingController.updateVastuBooking);
router.delete("/deletevastubookdetails/:id", vastuBookingController.deleteVastuBooking);

module.exports = router;
