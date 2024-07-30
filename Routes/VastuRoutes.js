const express = require("express");
const router = express.Router();
const path = require("path");
router.use(express.json());
const { getVastuByName, createVastu } = require("../Controller/VastuController");

router.get("/vastu/:name", getVastuByName);
router.post("/vastu", createVastu);

module.exports = router;
