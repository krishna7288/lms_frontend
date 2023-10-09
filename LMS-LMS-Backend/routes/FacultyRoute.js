const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getFaculty,
  createFaculty,
  updateFaculty,
  updateStatusFaculty,
  deleteFaculty,
  deleteFacultyLogin,
  getFacultyById,
  getFacultyByUniqueId,
  getFacultyByInstituteUniqueId
} = require("../controllers/FacultyController");

const uploadedFilenames = new Set();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/FacultyUploads");
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

const multipleUploads = upload.array("uploadProfile");

// Define routes and associate them with controller methods
router.get("/faculty", getFaculty);
router.post("/faculty", multipleUploads, createFaculty);
router.put("/faculty/:id", multipleUploads, updateFaculty);
router.put("/facultystatus/:id", updateStatusFaculty);
router.delete("/faculty/:id", deleteFaculty);
router.get("/faculty/:id", getFacultyById);
router.delete("/facultylogin/:id", deleteFacultyLogin);
router.get("/facultybyuniqueid/:id", getFacultyByUniqueId);
router.get("/facultybyinstituteuniqueid/:id", getFacultyByInstituteUniqueId);

module.exports = router;
