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

const booleanSchema = {
  type: Boolean,
  required: true,
};

const instituteSchema = new mongoose.Schema({
  uploadInstituteLogo: String,
  instituteID: stringUniqueSchema,
  instituteName: stringSchema,
  instituteType: stringSchema,
  pointOFContact: stringSchema,
  landlineNumber: numberSchema,
  mobileNumber: numberSchema,
  emailId: stringUniqueSchema,
  password:stringSchema,
  addressLine1: stringSchema,
  addressLine2: stringSchema,
  area: stringSchema,
  pinCode: stringSchema,
  country: stringSchema,
  state: stringSchema,
  district: stringSchema,
  numberOfBranches: numberSchema,
  numberOfStudents: numberSchema,
  numberOfFaculties: numberSchema,
  cloudSpace: numberSchema,
  vrEnabled: booleanSchema,
  cloudSpaceType: stringSchema,
  UniqueId:stringSchema,
  role: {
    type: Number,
    default: 3, // Set the default value to 'active'
  },
  status: {
    type: Number,
    default: 1, // Set the default value to 'active'
  },
  created_at: {
    type: String,
    default: formattedDate, // Set the default value to the current date and time
  },
});

const institutes = mongoose.model("institutes", instituteSchema);

module.exports = institutes;
