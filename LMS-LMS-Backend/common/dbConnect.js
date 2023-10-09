// common/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongooseURL = process.env.MONGOOSE_URL;

const connectDB = async () => {
  const dbName = "lms";
  try {
    await mongoose.connect(mongooseURL, {
      dbName: dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connectDB;
