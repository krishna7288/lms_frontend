const batches = require("../models/Batch");
const students = require("../models/Student");
const subject = require("../models/subject");

const getBatches = async (req, res) => {
  try {
    const data = await batches.find();
    res.status(200).json({
      error: false,
      status: 200,
      message: "Batches are found",
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
const createBatches = async (req, res) => {
  try {
    const file = req.files;

    const { facultyId, courseName, batchTimings } = req.body;

    const existingBatch = await batches.findOne({
      facultyId,
      courseName,
      batchTimings,
    });

    console.log(existingBatch);

    const idResponse = await batches.find({ batchId: req.body.batchId });

    const batchData = {
      uploadStudentData: file[0].filename,
      batchId: req.body.batchId,
      batchName: req.body.batchName,
      courseId: req.body.courseId,
      courseName: req.body.courseName,
      facultyName: req.body.facultyName,
      facultyId: req.body.facultyId,
      batchTimings: req.body.batchTimings,
      noOfStudents: req.body.noOfStudents,
      startDate: req.body.startDate,
      UniqueId: req.body.UniqueId,
      instituteUniqueId: req.body.instituteUniqueId,
    };

    if (idResponse.length === 1) {
      return res.json({
        status: 301,
        message: "Batch ID is already exist",
      });
    } else if (existingBatch) {
      return res.status(404).json({
        status: 404,
        message: `${existingBatch.courseName} Course is already assigned to ${existingBatch.facultyName} at this batch timings: ${existingBatch.batchTimings}`,
      });
    } else {
      const data = new batches(batchData);
      await data.save();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Branch created successfully",
        data: data,
      });
    }
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

const updateStatusBatch = async (req, res) => {
  console.log("update", req.body);

  try {
    const batchId = req.params.id;
    const updateData = {
      status: req.body.status,
    };

    // Use Mongoose to find the document by ID and update it
    const updatedBatch = await batches.findByIdAndUpdate(batchId, updateData);

    if (!updatedBatch) {
      return res.status(404).json({ message: "Branches are not found" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Branch updated successfully",
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

const deleteBatch = async (req, res) => {
  try {
    const batchId = req.params.id;

    // Use Mongoose to find the document by ID and update it
    const deletedBatch = await batches.findByIdAndRemove(batchId);

    if (!deletedBatch) {
      return res.status(404).json({ message: "Branches are not found" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Branch deleted successfully",
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

const updateBatch = async (req, res) => {
  console.log("update", req.body);

  const file = req.files;

  console.log(file);

  const batchId = req.params.id;

  const batchData = {
    uploadStudentData: file[0].filename,
    batchId: req.body.batchId,
    batchName: req.body.batchName,
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    facultyName: req.body.facultyName,
    facultyId: req.body.facultyId,
    batchTimings: req.body.batchTimings,
    noOfStudents: req.body.noOfStudents,
    startDate: req.body.startDate,
  };

  try {
    // Use Mongoose to find the document by ID and update it
    const updatedBatch = await batches.updateMany(
      { batchId: batchId },
      { $set: batchData }
    );

    if (updatedBatch.nModified === 0) {
      return res
        .status(404)
        .json({ message: "No items found matching the criteria" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Branch updated successfully",
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

const getBatchesById = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const batchIdToFind = req.params.id;

  console.log(batchIdToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await batches.find({ batchId: batchIdToFind });

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found matching the criteria" });
    }

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Branches are found",
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

const getBatchByUniqueId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await batches.find({ UniqueId: IDToFind });

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

const getBatchInstituteUniqueId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await batches.find({ instituteUniqueId: IDToFind });

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

const getBatchByFacultyUniqueId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    // const items = await batches.find({ facultyId: IDToFind });

    // if (!items || items.length === 0) {
    //   return res.status(404).json({
    //     status: 404,
    //     message: "No data found matching the criteria",
    //   });
    // }

    // if (items.length === 1) {
    const StudentDetails = await students.find({ batchId: IDToFind });

    if (!StudentDetails || StudentDetails.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No data found matching the criteria",
      });
    }

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Students are found",
      data: StudentDetails,
    });
    // }
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      details: err.message,
    });
  }
};

const getSubjectByStudentUniqueId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await students.find({ studentId: IDToFind });

    if (!items || items.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No data found matching the criteria",
      });
    }

    if (items.length === 1) {
      const getBatch = await batches.find({ batchId: items[0].batchId });

      if (!getBatch || getBatch.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No data found matching the criteria",
        });
      }

      if (getBatch.length === 1) {
        const SubjectDetails = await subject.find({
          UniqueId: getBatch[0].facultyId,
        });

        if (!SubjectDetails || items.SubjectDetails === 0) {
          return res.status(404).json({
            status: 404,
            message: "No data found matching the criteria",
          });
        }

        return res.status(200).json({
          error: false,
          status: 200,
          message: "Subjects are found",
          data: SubjectDetails,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      details: err.message,
    });
  }
};


const getCourseByFacultyId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await batches.find({ facultyId: IDToFind });

    console.log(items);

    if (!items || items.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No data found matching the criteria",
      });
    }

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Students are found",
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

const getFacultyBatchByCourseId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await batches.find({ courseId: IDToFind });

    if (!items || items.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No data found matching the criteria",
      });
    }
    return res.status(200).json({
      error: false,
      status: 200,
      message: "Students are found",
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
  getBatches,
  createBatches,
  updateStatusBatch,
  deleteBatch,
  updateBatch,
  getBatchesById,
  getBatchByUniqueId,
  getBatchInstituteUniqueId,
  getBatchByFacultyUniqueId,
  getSubjectByStudentUniqueId,
  getCourseByFacultyId,
  getFacultyBatchByCourseId,

};
