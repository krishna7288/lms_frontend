const express = require("express");
const router = express.Router();
const {
  getCourse,
  createCourse,
  updateCourse,
  updateStatusCourse,
  deleteCourse,
  getCourseById,
  getCourseByUniqueId,
  getCourseByInstituteUniqueId
} = require("../controllers/CourseAdditionController");


router.get("/courseaddition", getCourse);
router.post("/courseaddition",createCourse);
router.put("/courseaddition/:id",  updateCourse);
router.put("/courseadditionstatus/:id", updateStatusCourse);
router.delete("/courseaddition/:id", deleteCourse);
router.get("/courseaddition/:id", getCourseById);
router.get("/coursebyuniqueid/:id", getCourseByUniqueId);
router.get("/coursebyinstituteuniqueid/:id", getCourseByInstituteUniqueId);

module.exports = router;