const express = require("express");
const router = express.Router();
const {templeDetails,createTemple,getAllTemples}=require('../Controller/TempleController');
router.get('/getAllTemples',getAllTemples);
router.post('/createTemple',createTemple);
router.post('/templedetails',templeDetails);
module.exports = router;