const mongoose = require("mongoose");

// Define the nested schema for the type fields
const nestedTypeSchema = new mongoose.Schema({
  name: String,
  myths: String,
  description: String,
  img: String,
  head: String,
  type: String,
});

// Define the main schema
const vastuSchema = new mongoose.Schema({
  name: String,
  myths: String,
  description: String,
  img: String,
  head: String,
  type: String,
  types: [nestedTypeSchema], // Array of nested objects with the same structure
});

module.exports = mongoose.model("VastuModel", vastuSchema);
