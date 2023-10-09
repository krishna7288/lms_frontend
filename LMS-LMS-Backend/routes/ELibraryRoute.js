// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getElibrary,
  createElibrary,
  updateStatusByElibrary,
  deleteElibrary,
  updateElibrary,
  getElibraryById,
} = require("../controllers/ELibraryController");

const uploadedFilenames = new Set();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/ELibraryUploads");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename by combining the current timestamp and the original name
    const uniqueFilename = file.originalname;

    console.log(file);

    // Check if a file with the same filename has already been uploaded
    if (uploadedFilenames.has(uniqueFilename)) {
      uploadedFilenames.delete(uniqueFilename);
      console.log("File already exists. Skipped storing:", uniqueFilename);
      cb(null, uniqueFilename);
    } else {
      // If the file does not exist, store it with the unique filename
      uploadedFilenames.add(uniqueFilename); // Add the filename to the Set
      cb(null, uniqueFilename);
    }
  },
});

const upload = multer({ storage: storage });

const multipleUploads = upload.array("uploadThumbnail");

// Define routes and associate them with controller methods
router.get("/elibrary", getElibrary);
router.post("/elibrary", multipleUploads, createElibrary);
router.put("/elibrary/:id", multipleUploads, updateElibrary);
router.put("/elibrarystatus/:id", updateStatusByElibrary);
router.delete("/elibrary/:id", deleteElibrary);
router.get("/elibrary/:id", getElibraryById);
// ...other routes

module.exports = router;
