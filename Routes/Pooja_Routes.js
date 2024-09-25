 const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/Pooja_Pics"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

// Multer file filter configuration
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};
// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const poojaController = require("../Controller/PoojaController");

// Route to handle initial Pooja upload with at least 3 photos
// router.post(
//   "/upload-pooja",
//   upload.array("Pooja_images", 10),
//   poojaController.uploadPooja
// );

// Route to add more photos to an existing Pooja (maximum 2 additional photos allowed)
// router.put(
//   "/add-photos/:poojaId",
//   upload.array("Pooja_images", 2),
//   poojaController.addPhotos
router.post("/book-pooja/user-deatils/:id", poojaController.book_pooja_details);
// Route to delete a photo from an existing Pooja
// router.delete(
//   "/delete-photo/:poojaId/:photoIndex",
//   poojaController.deletePhoto
// );
module.exports = router;
