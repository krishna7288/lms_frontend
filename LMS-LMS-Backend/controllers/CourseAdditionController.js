const courses = require("../models/CourseAddition");

const getCourse = async (req, res) => {
  try {
    const data = await courses.find();
    res.status(200).json({
      error: false,
      status: 200,
      message: "Course found",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};
const createCourse = async (req, res) => {
  try {
    // const file = req.files;

    console.log(req.body);

    //console.log(file[0].filename);

    const courseData = {
      courseId: req.body.courseId,
      courseName: req.body.courseName,
      courseDuration: req.body.courseDuration,
      courseKeywords: req.body.courseKeywords,
      courseDescription: req.body.courseDescription,
      UniqueId: req.body.UniqueId,
      instituteUniqueId: req.body.instituteUniqueId,
    };

    console.log(courseData);

    const idResponse = await courses.find({ courseId: req.body.courseId });

    console.log(idResponse.length);

    if (idResponse.length === 1) {
      return res.json({
        status: 301,
        message: "Course ID is already exist",
      });
    } else {
      const data = new courses(courseData);
      await data.save();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Course created successfully",
        data: data,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      details: err.message,
    });
  }
};

const updateStatusCourse = async (req, res) => {
  console.log("update", req.body);

  try {
    const courseId = req.params.id;
    const updateData = {
      status: req.body.status,
    };

    // Use Mongoose to find the document by ID and update it
    const updatedCourse = await courses.findByIdAndUpdate(courseId, updateData);

    if (!updatedCourse) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Faculty updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Use Mongoose to find the document by ID and update it
    const deletedCourse = await courses.findByIdAndRemove(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Course deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const updateCourse = async (req, res) => {
  console.log("update", req.body);

  //const file = req.files;

  //console.log(file);

  const courseId = req.params.id;

  const courseData = {
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    courseDuration: req.body.courseDuration,
    courseKeywords: req.body.courseKeywords,
    courseDescription: req.body.courseDescription,
  };

  try {
    // Use Mongoose to find the document by ID and update it
    const updatedCourse = await courses.updateMany(
      { courseId: courseId },
      { $set: courseData }
    );

    if (updatedCourse.nModified === 0) {
      return res
        .status(404)
        .json({ message: "No items found matching the criteria" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Course updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getCourseById = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const courseIdToFind = req.params.id;

  console.log(courseIdToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await courses.find({ courseId: courseIdToFind });

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found matching the criteria" });
    }

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Course found",
      data: items,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getCourseByUniqueId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await courses.find({ UniqueId: IDToFind });

    if (!items || items.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No data found matching the criteria",
      });
    }

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Institutes are found",
      data: items,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      details: err.message,
    });
  }
};


const getCourseByInstituteUniqueId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await courses.find({ instituteUniqueId: IDToFind });

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "No data found matching the criteria",
        });
    }

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Institutes are found",
      data: items,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      details: err.message,
    });
  }
};

module.exports = {
  getCourse,
  createCourse,
  updateStatusCourse,
  deleteCourse,
  updateCourse,
  getCourseById,
  getCourseByUniqueId,
  getCourseByInstituteUniqueId
};
