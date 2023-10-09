const mongoose = require("mongoose");

const date = new Date();

// Extract day, month, and year components from the Date object
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
const year = String(date.getFullYear());

// Format the date in [DD/MM/YYYY] format
const formattedDate = `${day}/${month}/${year}`;

const batchSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  courseName: {
    type: String,
    required: true,
  },
  facultyId: { type: String, required: true },
  facultyName: {
    type: String,
    required: true,
    trim: true,
  },
  batchId: { type: String, required: true, unique: true },
  batchName: {
    type: String,
    required: true,
    trim: true,
  },
  batchTimings: String,
  startDate: {
    type: String,
    default: formattedDate,
  },
  uploadStudentData: String,
  noOfStudents: Number,
  UniqueId: String,
  instituteUniqueId: String,
  status: {
    type: Number,
    default: 1, // Set the default value to 'active'
  },
  created_at: {
    type: String,
    default: formattedDate, // Set the default value to the current date and time
  },
});

const batch = mongoose.model("Batch", batchSchema);

module.exports = batch;
