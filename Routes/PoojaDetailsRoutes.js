const express = require("express");
const router = express.Router();
const poojaController = require("../Controller/PoojaController");

router.post("/PoojaDetails", poojaController.PoojadetailsList);
router.get("/PoojaDetails/:id", poojaController.poojaDetails);

router.get("/panditpooja/:id");
module.exports = router;
