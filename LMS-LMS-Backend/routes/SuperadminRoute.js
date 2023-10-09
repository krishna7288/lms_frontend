// routes/userRoutes.js
const express = require("express");
const router = express.Router();
// const multer = require("multer");
const {
  getSuperadmin,
  createSuperadmin,
 
} = require("../controllers/SuperadminController");

// const uploadedFilenames = new Set();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads");
//   },
//   filename: function (req, file, cb) {
//     // Generate a unique filename by combining the current timestamp and the original name
//     const uniqueFilename = file.originalname;

//     console.log(file);

//     // Check if a file with the same filename has already been uploaded
//     if (uploadedFilenames.has(uniqueFilename)) {
//       uploadedFilenames.delete(uniqueFilename);
//       console.log("File already exists. Skipped storing:", uniqueFilename);
//       cb(null, uniqueFilename);
//     } else {
//       // If the file does not exist, store it with the unique filename
//       uploadedFilenames.add(uniqueFilename); // Add the filename to the Set
//       cb(null, uniqueFilename);
//     }
//   },
// });

// const upload = multer({ storage: storage });

// const multipleUploads = upload.array("uploadProfilePic");

// Define routes and associate them with controller methods
router.get("/superadmin", getSuperadmin);
router.post("/superadmin", createSuperadmin);


// router.put("/adminlogin/:id", multipleUploads, updateAdmin);
// router.put("/adminloginstatus/:id", updateStatusByAdmin);
// router.delete("/adminlogin/:id", deleteAdmin);
// router.get("/adminlogin/:id", getAdminById);
// ...other routes

module.exports = router;
