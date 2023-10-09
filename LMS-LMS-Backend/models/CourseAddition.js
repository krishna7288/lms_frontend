const mongoose = require("mongoose");


const date = new Date();

// Extract day, month, and year components from the Date object
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
const year = String(date.getFullYear());

// Format the date in [DD/MM/YYYY] format
const formattedDate = `${day}/${month}/${year}`;

const courseAdditionSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  courseName: {
    type: String,
    required: true,
  },
  courseKeywords: String,
  courseDuration: String,
  courseDescription: String,
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

const courseAddition = mongoose.model("Courses", courseAdditionSchema);

module.exports = courseAddition;
