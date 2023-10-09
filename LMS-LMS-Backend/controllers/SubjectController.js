const Subject = require("../models/subject");
const fs = require("fs"); // Require the 'fs' module for file operations

// Create a new subject
exports.createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json({ message: "Subject Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error in Subject Create:", error);
  }
};

// Retrieve all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a subject by ID
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a subject by ID
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubject = await Subject.findByIdAndRemove(id);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(204).json(); // Respond with a 204 status code for successful deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new section within a subject
exports.createSection = async (req, res) => {
  try {
    const { subjectName } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const newSection = req.body;
    subject.sections.push(newSection);
    await subject.save();

    res.status(201).json(newSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Retrieve all sections of a subject
exports.getAllSections = async (req, res) => {
  try {
    const { subjectName } = req.params;
    const subject = await Subject.findOne({ subjectName });

    console.log(subject.sections);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({
      data: subject.sections,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a section within a subject by ID
exports.updateSection = async (req, res) => {
  try {
    const { subjectName, sectionId } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const section = subject.sections.find(
      (section) => section._id == sectionId
    );
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    Object.assign(section, req.body);
    await subject.save();

    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a section within a subject by ID
exports.deleteSection = async (req, res) => {
  try {
    const { subjectName, sectionId } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const sectionIndex = subject.sections.findIndex(
      (section) => section._id == sectionId
    );
    if (sectionIndex === -1) {
      return res.status(404).json({ message: "Section not found" });
    }

    subject.sections.splice(sectionIndex, 1);
    await subject.save();

    res.status(204).json(); // Respond with a 204 status code for successful deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new topic within a section of a subject
exports.createTopic = async (req, res) => {
  try {
    const { subjectName, sectionId } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const section = subject.sections.find(
      (section) => section._id == sectionId
    );
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const newTopic = req.body;
    section.topics.push(newTopic);
    await subject.save();

    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Retrieve all topics within a section of a subject
exports.getAllTopics = async (req, res) => {
  try {
    const { subjectName, sectionId } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const section = subject.sections.find(
      (section) => section._id == sectionId
    );
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.status(200).json(section.topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a topic within a section of a subject by ID
exports.updateTopic = async (req, res) => {
  try {
    const { subjectName, sectionId, topicId } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const section = subject.sections.find(
      (section) => section._id == sectionId
    );
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const topic = section.topics.find((topic) => topic._id == topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    Object.assign(topic, req.body);
    await subject.save();

    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a topic within a section of a subject by ID
exports.deleteTopic = async (req, res) => {
  try {
    const { subjectName, sectionId, topicId } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const section = subject.sections.find(
      (section) => section._id == sectionId
    );
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const topicIndex = section.topics.findIndex(
      (topic) => topic._id == topicId
    );
    if (topicIndex === -1) {
      return res.status(404).json({ message: "Topic not found" });
    }

    section.topics.splice(topicIndex, 1);
    await subject.save();

    res.status(204).json(); // Respond with a 204 status code for successful deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createContent = async (req, res) => {
  try {
    const { subjectName, sectionId, topicId } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const section = subject.sections.find(
      (section) => section._id == sectionId
    );
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const topic = section.topics.find((topic) => topic._id == topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Check if the request contains both body and file
    if (!req.body && !req.files) {
      return res.status(400).json({ message: "No content provided" });
    }

    const newContent = {
      title: req.body.title, // Assuming you have a 'title' field in your request body
      body: req.body.body, // Assuming you have a 'body' field in your request body
    };

    if (req.files) {
      // If files are provided, add them to the newContent object
      newContent.file = req.files[0].filename; // Save the file ID (filename)
    }

    topic.contents.push(newContent);
    await subject.save();

    res.status(201).json(newContent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Retrieve all content within a specific topic of a section of a subject
exports.getAllContents = async (req, res) => {
  try {
    const { subjectName, sectionId, topicId } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const section = subject.sections.find(
      (section) => section._id == sectionId
    );
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const topic = section.topics.find((topic) => topic._id == topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const contents = topic.contents;

    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateContent = async (req, res) => {
  try {
    const { subjectName, sectionId, topicId, contentId } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const section = subject.sections.find(
      (section) => section._id == sectionId
    );
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const topic = section.topics.find((topic) => topic._id == topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const content = topic.contents.find((content) => content._id == contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Check if the request body contains a 'body' property
    if (req.body.hasOwnProperty("body")) {
      // Update the 'body' property if it exists in the request
      content.body = req.body.body;
    }

    // Check if the request body contains a 'file' property
    if (req.body.hasOwnProperty("file")) {
      // Update the 'file' property if it exists in the request
      content.file = req.body.file;
    }

    await subject.save();

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





exports.deleteContent = async (req, res) => {
  try {
    const { subjectName, sectionId, topicId, contentId } = req.params;
    const subject = await Subject.findOne({ subjectName });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const section = subject.sections.find(
      (section) => section._id == sectionId
    );
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const topic = section.topics.find((topic) => topic._id == topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const contentIndex = topic.contents.findIndex(
      (content) => content._id == contentId
    );
    if (contentIndex === -1) {
      return res.status(404).json({ message: "Content not found" });
    }

    const deletedContent = topic.contents.splice(contentIndex, 1)[0]; // Remove and store the deleted content

    // Check if the content has a file reference and delete it from the file system
    if (deletedContent.file) {
      const filePath = `public/NotesUploads/${deletedContent.file}`; // Adjust the file path as needed
      fs.unlinkSync(filePath); // Delete the file
    }

    await subject.save();

    res.status(204).json(); // Respond with a 204 status code for successful deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Controller function to create a new subject with file upload
// exports.createSubject = async (req, res) => {
//   try {
//     const subject = new Subject(req.body);
//     await subject.save();
//     res.status(201).json(subject);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.getSubjectByUniqueId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await Subject.find({ batchId: IDToFind });

    console.log(items.length);

    if (!items || items.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No data found matching the criteria",
      });
    }
    return res.status(200).json({
      error: false,
      status: 200,
      message: "Subjects are found",
      data: items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      details: err.message,
    });
  }
};
