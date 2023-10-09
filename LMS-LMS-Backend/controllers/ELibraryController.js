// // controllers/userController.js
const elibraries = require("../models/ELibrary");

const getElibrary = async (req, res) => {
  try {
    const data = await elibraries.find();
    res.status(200).json({
      error: false,
      status: 200,
      message: "Data are found",
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

const createElibrary = async (req, res) => {
  try {
    const file = req.files;

    console.log(file[0].filename);

    const elibraryData = {
      uploadThumbnail: file[0].filename,
      LibraryCategory: req.body.LibraryCategory,
      CourseName: req.body.CourseName,
      title: req.body.title,
      authorName: req.body.authorName,
      description: req.body.description,
      keywords: req.body.keywords,
      externalLinks: req.body.externalLinks,
    };

    const data = new elibraries(elibraryData);
    await data.save();
    res.status(200).json({
      error: false,
      status: 200,
      message: "Data created successfully",
      data: data,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const updateStatusByElibrary = async (req, res) => {
  console.log("update", req.body);

  try {
    const elibraryId = req.params.id;
    const updateData = {
      status: req.body.status,
    };

    // Use Mongoose to find the document by ID and update it
    const updatedElibrary = await elibraries.findByIdAndUpdate(
      elibraryId,
      updateData
    );

    if (!updatedElibrary) {
      return res.status(404).json({ message: "Data are not found" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Data updated successfully",
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

const deleteElibrary = async (req, res) => {
  try {
    const elibraryId = req.params.id;

    // Use Mongoose to find the document by ID and update it
    const deletedElibrary = await elibraries.findByIdAndRemove(elibraryId);

    if (!deletedElibrary) {
      return res.status(404).json({ message: "Data are not found" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Data deleted successfully",
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

const updateElibrary = async (req, res) => {
  console.log("update", req.body);

  const file = req.files;

  console.log(file);

  const elibraryCourseName = req.params.id;

  const ImageCheck = await elibraries.find({
    uploadThumbnail: req.body.uploadThumbnail,
  });

  console.log(req.body.uploadThumbnail);

  const elibraryData = {
    uploadThumbnail: ImageCheck.length >= 1 ? req.body.uploadThumbnail : file[0].filename,
    LibraryCategory: req.body.LibraryCategory,
    CourseName: req.body.CourseName,
    title: req.body.title,
    authorName: req.body.authorName,
    description: req.body.description,
    keywords: req.body.keywords,
    externalLinks: req.body.externalLinks,
  };

  try {
    // Use Mongoose to find the document by ID and update it
    const updatedElibrary = await elibraries.updateMany(
      { CourseName: elibraryCourseName },
      { $set: elibraryData }
    );

    if (updatedElibrary.nModified === 0) {
      return res
        .status(404)
        .json({ message: "No Data found matching the criteria" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Data updated successfully",
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

const getElibraryById = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const elibraryCourseNameToFind = req.params.id;

  console.log(elibraryCourseNameToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const data = await elibraries.find({ CourseName: elibraryCourseNameToFind });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found matching the criteria" });
    }

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Data are found",
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

module.exports = {
  getElibrary,
  createElibrary,
  updateStatusByElibrary,
  deleteElibrary,
  updateElibrary,
  getElibraryById,
};
