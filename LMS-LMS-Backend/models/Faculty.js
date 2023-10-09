const mongoose = require('mongoose');


const date = new Date();

// Extract day, month, and year components from the Date object
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
const year = String(date.getFullYear());

// Format the date in [DD/MM/YYYY] format
const formattedDate = `${day}/${month}/${year}`;

const facultyLoginSchema = new mongoose.Schema({
  uploadProfile: String,
  facultyId: {type: String,
    required: true,
    unique: true, 
  },
  facultyName: {
    type: String,
    required: true,
    trim: true, 
  },
  employeecode: String,
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
  designation: String,
  gender: String,
  qualification: String,
  description: String,
  UniqueId:String,
  instituteUniqueId:String,
  dob: {
    type: String,
    default: formattedDate,
      },
  yoj: {
    type: String,
    default: formattedDate,
  },
  role: {
    type: Number,
    default: 7, // Set the default value to 'active'
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

const facultyLogin =mongoose.model("Faculty", facultyLoginSchema);

module.exports = facultyLogin;
