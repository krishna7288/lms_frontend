// subject.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: String,
  body: String,
  file: String, // Store the file path
});

const topicSchema = new mongoose.Schema({
  title: String,
  contents: [contentSchema],
});

const sectionSchema = new mongoose.Schema({
  title: String,
  topics: [topicSchema],
});

const subjectSchema = new mongoose.Schema({
  subjectName: String,
  subjectCode: String,
  facultyName: String,
  sections: [sectionSchema],
  UniqueId : String,
  batchId: String,
});

module.exports = mongoose.model('Subject', subjectSchema);