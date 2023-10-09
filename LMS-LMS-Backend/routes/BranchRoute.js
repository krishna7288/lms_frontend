const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getBranches,
  createBranches,
  updateBranch,
  updateStatusBranch,
  deleteBranch,
  deleteBranchLogin,
  getBranchesById,
  getBranchByUniqueId,
  getBranchByInstituteUniqueId
} = require("../controllers/BranchController");

const uploadedFilenames = new Set();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/BranchUploads");
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

const multipleUploads = upload.array("uploadBranchLogo");

// Define routes and associate them with controller methods
router.get("/branch", getBranches);
router.post("/branch", multipleUploads, createBranches);
router.put("/branch/:id", multipleUploads, updateBranch);
router.put("/branchstatus/:id", updateStatusBranch);
router.delete("/branch/:id", deleteBranch);
router.delete("/branchlogin/:id", deleteBranchLogin);
router.get("/branch/:id", getBranchesById);
router.get("/branchuniqueid/:id", getBranchByUniqueId);
router.get("/branchbyinstituteuniqueid/:id", getBranchByInstituteUniqueId);

module.exports = router;
