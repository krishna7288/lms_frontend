const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getBatches,
  createBatches,
  updateBatch,
  updateStatusBatch,
  deleteBatch,
  getBatchesById,
  getBatchByUniqueId,
  getBatchInstituteUniqueId,
  getBatchByFacultyUniqueId,
  getSubjectByStudentUniqueId,
  getCourseByFacultyId,
  getFacultyBatchByCourseId,
} = require("../controllers/BatchController");

const uploadedFilenames = new Set();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/BatchUploads");
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

const multipleUploads = upload.array("uploadStudentData");

// Define routes and associate them with controller methods
router.get("/batch", getBatches);
router.post("/batch", multipleUploads, createBatches);
router.put("/batch/:id", multipleUploads, updateBatch);
router.put("/batchstatus/:id", updateStatusBatch);
router.delete("/batch/:id", deleteBatch);
router.get("/batch/:id", getBatchesById);
router.get("/batchbyuniqueid/:id", getBatchByUniqueId);
router.get("/batchbyinstitutquniqueid/:id", getBatchInstituteUniqueId);
router.get("/batchbyfacultyuniqueid/:id", getBatchByFacultyUniqueId);
router.get("/batchbystudentid/:id", getSubjectByStudentUniqueId);
router.get("/coursebyfacultyid/:id", getCourseByFacultyId);
router.get("/facultybatchbycourseid/:id", getFacultyBatchByCourseId);

module.exports = router;