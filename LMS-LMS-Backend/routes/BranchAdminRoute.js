// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getBranchAdmins,
  createBranchAdmin,
  updateStatusByBranchAdmin,
  updateBranchAdmin,
  deleteBranchAdmin,
  deleteBranchAdminLogin,
  getBranchAdminById,
  getBranchAdminByBranchUniqueId
} = require("../controllers/BranchAdminController");

const uploadedFilenames = new Set();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/BranchAdminUploads");
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
router.get("/branchadmin", getBranchAdmins);
router.post("/branchadmin", multipleUploads, createBranchAdmin);
router.put("/branchadmin/:id", multipleUploads, updateBranchAdmin);
router.put("/branchadminstatus/:id", updateStatusByBranchAdmin);
router.delete("/branchadmin/:id", deleteBranchAdmin);
router.delete("/branchadminlogin/:id", deleteBranchAdminLogin);
router.get("/branchadmin/:id", getBranchAdminById);
router.get("/branchadminbybranchuniqueid/:id", getBranchAdminByBranchUniqueId);
// ...other routes

module.exports = router;
