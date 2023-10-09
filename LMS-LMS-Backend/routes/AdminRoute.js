// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");

const {
  getAdmins,
  createAdmin,
  updateStatusByAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminById,
  deleteAdminLogin
} = require("../controllers/AdminController");

const uploadedFilenames = new Set();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/AdminUploads");
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

//jwt authentication

const verifyJWT = (req, res, next) => {
 
  const accessToken = req.headers.authorization;

  console.log(accessToken);

  if (!accessToken) {
    return res.status(401).json({
      status : 401,
      message : "Access token is missing or Invalid"
    });
  }

  const token = accessToken.split(" ")[1];

  jwt.verify(
    token,
    "weightlossjwtsecret",
    { algorithms: ["HS256"] },
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          auth: false,
          message: "Failed to authenticate",
        });
      }
      req._id = decoded._id;
      next();
    }
  );
};

// Define routes and associate them with controller methods
router.get("/admin", getAdmins);
router.post("/admin", multipleUploads, createAdmin);
router.put("/admin/:id", multipleUploads, updateAdmin);
router.put("/adminstatus/:id", updateStatusByAdmin);
router.delete("/admin/:id", deleteAdmin);
router.delete("/adminlogin/:id", deleteAdminLogin);
router.get("/admin/:id", getAdminById);
// ...other routes

module.exports = router;
