// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getInstituteAdmins,
  createInstituteAdmin,
  updateStatusByInstituteAdmin,
  updateInstituteAdmin,
  deleteInstituteAdmin,
  getInstituteAdminById,
  deleteInstituteAdminLogin,
  getInstituteAdminByInstituteUniqueId
} = require("../controllers/InstituteAdminController");

const uploadedFilenames = new Set();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/InstituteAdminUploads");
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

const multipleUploads = upload.array("uploadProfilePic");

// Define routes and associate them with controller methods
router.get("/instituteadmin", getInstituteAdmins);
router.post("/instituteadmin", multipleUploads, createInstituteAdmin);
router.put("/instituteadmin/:id", multipleUploads, updateInstituteAdmin);
router.put("/instituteadminstatus/:id", updateStatusByInstituteAdmin);
router.delete("/instituteadmin/:id", deleteInstituteAdmin);
router.delete("/instituteadminlogin/:id", deleteInstituteAdminLogin);
router.get("/instituteadmin/:id", getInstituteAdminById);
router.get("/instituteadminbyinstituteuniqueid/:id", getInstituteAdminByInstituteUniqueId);
// ...other routes

module.exports = router;
