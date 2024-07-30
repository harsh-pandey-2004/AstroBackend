const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios"); // Make sure to require axios
const cors = require("cors");

const server = express();
const PORT = 3000;
const apiKey = "AIzaSyBvnHKYalPScRMFLmx-vUsfdLwkRxAyjyw"; // Use environment variable for API key
server.use(express.json()); // Middleware to parse JSON bodies

server.use(cors());
server.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://astrocaptain0612:astrocaptain0612@cluster0.ompgjjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
connectDB();

// Google Places endpoint
server.get("/places", async (req, res) => {
  const { input } = req.query;
  console.log("Input received:", input);

  if (!input) {
    return res.status(400).send({ error: "Input is required" });
  }

  const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;

  try {
    const response = await axios.get(endpoint, {
      params: {
        input,
        types: "(cities)",
        key: apiKey,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching suggestions:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send({ error: "Error fetching suggestions" });
  }
});

// Import routes
const poojaDetailsRoutes = require("./Routes/PoojaDetailsRoutes");
const userRoutes = require("./Routes/UserRoutes");
const AstrologerRoutes = require("./Routes/AstrologerRoutes");
const panditRoutes = require("./Routes/Pandit_Routes");
const AstroCoucellor = require("./Routes/AstroloCouncellorController");
const VastuRoutes = require("./Routes/VastuRoutes")


server.use("/api", userRoutes);
server.use("/api", AstroCoucellor);
server.use("/api", poojaDetailsRoutes);
server.use("/api", AstrologerRoutes);
server.use("/api", panditRoutes);
server.use("/api", VastuRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
