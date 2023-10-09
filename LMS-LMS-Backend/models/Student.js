const mongoose = require("mongoose");

const date = new Date();

// Extract day, month, and year components from the Date object
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
const year = String(date.getFullYear());

// Format the date in [DD/MM/YYYY] format
const formattedDate = `${day}/${month}/${year}`;

const studentLoginSchema = new mongoose.Schema({
  uploadStudentProfile: String,
  studentId: { type: String, required: true, unique: true },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  courseName: String,
  courseId: String,
  batchName: String,
  batchId: String,
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
    default: formattedDate,
  },
  mobileNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  parentName: String,
  parentNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  addressLine1: String,
  addressLine2: String,
  area: String,
  country: String,
  state: String,
  district: String,
  pincode: Number,
  description: String,
  UniqueId: String,
  instituteUniqueId: String,
  role: {
    type: Number,
    default: 8, // Set the default value to 'active'
  },
  status: {
    type: Number,
    default: 1, // Set the default value to 'active'
  },
  created_at: {
    type: String,
    default: formattedDate, // Set the default value to the current date and time
  },
  password: String,
  bloodGroup: String,
});

const studentLogin = mongoose.model("Student", studentLoginSchema);

module.exports = studentLogin;
