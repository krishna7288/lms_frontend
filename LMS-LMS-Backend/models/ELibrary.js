// models/user.js
const mongoose = require("mongoose");

const date = new Date();

// Extract day, month, and year components from the Date object
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
const year = String(date.getFullYear());

// Format the date in [DD/MM/YYYY] format
const formattedDate = `${day}/${month}/${year}`;

const stringSchema = {
  type: String,
  required: true,
  trim: true,
};

const adminsLoginSchema = new mongoose.Schema({
  uploadThumbnail: String,
  LibraryCategory: stringSchema,
  CourseName: stringSchema,
  title: stringSchema,
  authorName: stringSchema,
  description: stringSchema,
  keywords: stringSchema,
  externalLinks: stringSchema,
  status: {
    type: Number,
    default: 1, // Set the default value to 'active'
  },
  created_at: {
    type: String,
    default: formattedDate, // Set the default value to the current date and time
  },
});

const elibraries = mongoose.model("elibraries", adminsLoginSchema);

module.exports = elibraries;
