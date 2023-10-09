// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getInstitutes,
  createInstitutes,
  updateStatusByInstitute,
  deleteInstitute,
  updateInstitute,
  getInstitutesById,
  deleteInstituteLogin,
  getInstitutesByUniqueId
} = require("../controllers/InstituteController");

const uploadedFilenames = new Set();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/InstituteUploads");
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

const multipleUploads = upload.array("uploadInstituteLogo");

// Define routes and associate them with controller methods
router.get("/institute", getInstitutes);
router.post("/institute", multipleUploads, createInstitutes);
router.put("/institute/:id", multipleUploads, updateInstitute);
router.put("/institutestatus/:id", updateStatusByInstitute);
router.delete("/institute/:id", deleteInstitute);
router.delete("/institutelogin/:id", deleteInstituteLogin);
router.get("/institute/:id", getInstitutesById);
router.get("/institutebyuniqueid/:id", getInstitutesByUniqueId);
// ...other routes

module.exports = router;
