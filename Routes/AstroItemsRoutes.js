const express = require('express');
const router = express.Router();
const itemController = require('../Controller/AstroItemsController');

// Get all items
router.get('/getitems', itemController.getAllItems);

// Get item by ID
router.get('/getitems/:id', itemController.getItemById);

// Create a new item
router.post('/createitems', itemController.createItem);

// Update an item by ID
router.put('/updateitems/:id', itemController.updateItem);

// Delete an item by ID
router.delete('/deleteitems/:id', itemController.deleteItem);

module.exports = router;
