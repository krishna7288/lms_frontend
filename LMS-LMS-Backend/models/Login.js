// models/user.js
const mongoose = require("mongoose");

const date = new Date();

// Extract day, month, and year components from the Date object
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
const year = String(date.getFullYear());

// Format the date in [DD/MM/YYYY] format
const formattedDate = `${day}/${month}/${year}`;

const stringUniqueSchema = {
  type: String,
  required: true,
  unique: true,
  trim: true,
};

const stringSchema = {
  type: String,
  required: true,
  trim: true,
};
const numberSchema = {
  type: Number,
  required: true,
};

const loginsSchema = new mongoose.Schema({
  id:stringSchema,
  emailId: stringUniqueSchema,
  password: stringSchema,
  role: numberSchema,
  status: numberSchema,
  permission: {
    add: Boolean,
    edit: Boolean,
    delete: Boolean,
  },
  instituteUniqueId:String,
  branchUniqueId:String,
  reportGeneration: {
    add: Boolean,
  },
  created_at: {
    type: String,
    default: formattedDate, // Set the default value to the current date and time
  },
});

const logins = mongoose.model("logins", loginsSchema);

module.exports = logins;
