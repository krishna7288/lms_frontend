const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getStudents,
  createStudents,
  updateStudent,
  updateStatusStudent,
  deleteStudent,
  getStudentsById,
  deleteStudentLogin,
  getStudentByUniqueId,
  getStudentByInstituteUniqueId
} = require("../controllers/StudentController");

const uploadedFilenames = new Set();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/StudentUploads");
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

const multipleUploads = upload.array("uploadStudentProfile");

// Define routes and associate them with controller methods
router.get("/student", getStudents);
router.post("/student", multipleUploads, createStudents);
router.put("/student/:id", multipleUploads, updateStudent);
router.put("/studentstatus/:id", updateStatusStudent);
router.delete("/student/:id", deleteStudent);
router.delete("/studentlogin/:id", deleteStudentLogin);
router.get("/student/:id", getStudentsById);
router.get("/studentbyuniqueid/:id", getStudentByUniqueId);
router.get("/studentbyinstituteuniqueid/:id", getStudentByInstituteUniqueId);
module.exports = router;