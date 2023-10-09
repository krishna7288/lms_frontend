const express = require("express");
const router = express.Router();
const multer = require("multer"); // Import multer
const path = require("path");
const subjectController = require("../controllers/SubjectController");

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/NotesUploads"); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Define the file name
  },
});

// Subjects
router.post("/subjects", subjectController.createSubject);
router.get("/subjects", subjectController.getAllSubjects);
router.get("/subjects/:id", subjectController.getSubjectByUniqueId);
router.patch("/subjects/:id", subjectController.updateSubject);
router.delete("/subjects/:id", subjectController.deleteSubject);




// Sections within a subject
router.post("/:subjectName/sections", subjectController.createSection);
router.get("/:subjectName/sections", subjectController.getAllSections);
router.patch(
  "/:subjectName/sections/:sectionId",
  subjectController.updateSection
);
router.delete(
  "/:subjectName/sections/:sectionId",
  subjectController.deleteSection
);





// Topics within a section of a subject
router.post(
  "/:subjectName/sections/:sectionId/topics",
  subjectController.createTopic
);
router.get(
  "/:subjectName/sections/:sectionId/topics",
  subjectController.getAllTopics
);
router.patch(
  "/:subjectName/sections/:sectionId/topics/:topicId",
  subjectController.updateTopic
);
router.delete(
  "/:subjectName/sections/:sectionId/topics/:topicId",
  subjectController.deleteTopic
);





const upload = multer({ storage: storage });

const multiUploads = upload.array("file");

// Contents within a specific topic of a section of a subject
router.post(
  "/:subjectName/sections/:sectionId/topics/:topicId/contents",
  multiUploads,
  subjectController.createContent
);
router.get(
  "/:subjectName/sections/:sectionId/topics/:topicId/contents",
  subjectController.getAllContents
);
router.put(
  "/:subjectName/sections/:sectionId/topics/:topicId/contents/:contentId",
  subjectController.updateContent
);
router.delete(
  "/:subjectName/sections/:sectionId/topics/:topicId/contents/:contentId",
  subjectController.deleteContent
);


module.exports = router;
