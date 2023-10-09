const mongoose = require('mongoose');


const date = new Date();

// Extract day, month, and year components from the Date object
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
const year = String(date.getFullYear());

// Format the date in [DD/MM/YYYY] format
const formattedDate = `${day}/${month}/${year}`;

const branchLoginSchema = new mongoose.Schema({
  uploadBranchLogo: String,
  branchId: { type: String, required: true, unique: true },
  branchName:String,
  branchType: String,
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  landlineNumber: Number,
  pointOFContact: String,
  cloudSpace: Number,
  vrEnabled: Boolean,
  cloudSpaceType: String,
  addressLine1: String,
  addressLine2: String,
  area: String,
  country: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  district: String,
  pincode: String,
  UniqueId: String,
  instituteUniqueId: String,
  role: {
    type: Number,
    default: 5, // Set the default value to 'active'
    unique: true,
  },
  status: {
    type: Number,
    default: 1, // Set the default value to 'active'
  },
  created_at: {
    type: String,
    default: formattedDate, // Set the default value to the current date and time
  },
  role: {
    type: Number,
    default: 5, // Set the default value to 'active'
  },
  status: {
    type: Number,
    default: 1, // Set the default value to 'active'
  },
  password: String,
});

const branchesLogin =mongoose.model("Branch", branchLoginSchema);

module.exports = branchesLogin;
