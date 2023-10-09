const students = require("../models/Student");
const bcrypt = require("bcryptjs");
const logins = require("../models/Login");

const getStudents = async (req, res) => {
    try {
      const data = await students.find();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Students are found",
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        status: 500,
        message: "Internal server error",
        error: err.message,
      });
    }
  };
  const createStudents = async (req, res) => {
    try {
      const file = req.files;

      //console.log(req.body)
  
      //console.log(file[0].filename);

      const password = req.body.password;

      // console.log(password);
 
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      const studentData = {
        uploadStudentProfile: file[0].filename,
        studentId: req.body.studentId,
        studentName: req.body.studentName,
        courseName: req.body.courseName,
        courseId: req.body.courseId,
        batchName: req.body.batchName,
        batchId: req.body.batchId,
        emailId: req.body.emailId,
        mobileNumber:req.body.mobileNumber,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        area: req.body.area,
        pincode: req.body.pincode,
        country: req.body.country,
        state: req.body.state,
        district: req.body.district,
        dob: req.body.dob,
        parentName: req.body.parentName,
        parentNumber: req.body.parentNumber,
        description:req.body.description,
        password:hashedPassword,
        bloodGroup:req.body.bloodGroup,
        UniqueId: req.body.UniqueId,
        instituteUniqueId: req.body.instituteUniqueId,
      };
  
      // console.log(studentData);

      const response = await logins.find({ emailId: req.body.emailId });

      const idResponse = await logins.find({ id: req.body.studentId});

      console.log("response:",idResponse);
  
      const Login = {
        id: req.body.studentId,
        emailId: req.body.emailId,
        password: hashedPassword,
        role: 8,
        status: 1,
      };

      if (response.length === 1) {
        return res.json({
          status: 301,
          message: "Email ID is already exist",
        });
      } else if (idResponse.length === 1) {
        return res.json({
          status: 301,
          message: "Student ID is already exist",
        });
      } else {
        const loginData = new logins(Login);
        await loginData.save();
        console.log(loginData);
  
      const data = new students(studentData);
      await data.save();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Student created successfully",
        data: data,
      });
    }
   } catch (err) {
      console.log(err.message);
      res.status(500).json({
        error: true,
        status: 500,
        message: "Internal server error",
       details: err.message,
      });
    }
  };
  
  const updateStatusStudent = async (req, res) => {
    console.log("update", req.body);

    const studentId = req.params.id;

    console.log(studentId);
    try {
     
    
  
      // Use Mongoose to find the document by ID and update it
      const updatedStudent = await students.updateOne(
        {studentId:studentId},
        {$set:{status:req.body.status}}
      );
  
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student are not found" });
      }
      const loginData = await logins.updateOne(
        { id: studentId },
        { $set: { status: req.body.status } }
      );
      console.log(loginData);

      res.status(200).json({
        error: false,
        status: 200,
        message: "Student updated successfully",
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

  const deleteStudent = async (req, res) => {
    try {
      const studentId = req.params.id;
  
      // Use Mongoose to find the document by ID and update it
      const deletedStudent = await students.findByIdAndRemove(studentId);
  
      if (!deletedStudent) {
        return res.status(404).json({ message: "Student are not found" });
      }
  
      res.status(200).json({
        error: false,
        status: 200,
        message: "Student deleted successfully",
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
  const deleteStudentLogin = async (req, res) => {
    try {
      const studentId = req.params.id;
      // Use Mongoose to find the document by ID and update it
      const deletedStudent = await logins.findOneAndDelete({ id: studentId });
  
      if (!deletedStudent) {
        return res.status(404).json({ message: "Students are not found" });
      }
      res.status(200).json({
        error: false,
        status: 200,
        message: "Student login deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        details: err.message,
      });
    }
  };
  

  const updateStudent = async (req, res) => {
    console.log("update", req.body);
  
    const file = req.files;
  
    console.log(req.body.uploadStudentProfile)

   const ImageCheck = await students.find({uploadStudentProfile : req.body.uploadStudentProfile})

   console.log(ImageCheck.length >= 1)

    const password = req.body.password;

    console.log(password);

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
  
    const passwordHashCheck = await logins.find({ password: req.body.password });

    const studentId = req.params.id;
  
    const studentData = {
        uploadStudentProfile: ImageCheck.length >= 1 ? req.body.uploadStudentProfile : file[0].filename,
        studentId: req.body.studentId,
        studentName: req.body.studentName,
        courseName: req.body.courseName,
        courseId: req.body.courseId,
        batchName: req.body.batchName,
        batchId: req.body.batchId,
        emailId: req.body.emailId,
        mobileNumber:req.body.mobileNumber,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        area: req.body.area,
        pincode: req.body.pincode,
        country: req.body.country,
        state: req.body.state,
        district: req.body.district,
        dob: req.body.dob,
        parentName: req.body.parentName,
        parentNumber: req.body.parentNumber,
        description:req.body.description,
        password: passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
        bloodGroup:req.body.bloodGroup
      };
      const studentDataWithoutMail = {
        uploadStudentProfile:  ImageCheck.length >= 1 ? req.body.uploadStudentProfile: file[0].filename,
        studentId: req.body.studentId,
        studentName: req.body.studentName,
        courseName: req.body.courseName,
        courseId: req.body.courseId,
        batchName: req.body.batchName,
        batchId: req.body.batchId,
        mobileNumber:req.body.mobileNumber,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        area: req.body.area,
        pincode: req.body.pincode,
        country: req.body.country,
        state: req.body.state,
        district: req.body.district,
        dob: req.body.dob,
        parentName: req.body.parentName,
        parentNumber: req.body.parentNumber,
        description:req.body.description,
        password: passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
        bloodGroup:req.body.bloodGroup
      };
      const loginWithoutMail = {
        password: passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
      };
    
      const Login = {
        emailId: req.body.emailId,
        password: passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
      };
    try {
      const response = await logins.find({ emailId: req.body.emailId });

      if (response.length === 1) {
        const response1 = await logins.findOne({ emailId: req.body.emailId });

        if (response1.id === req.body.studentId) {
        const loginData = await logins.updateMany(
          {id:studentId },
          { $set: loginWithoutMail }
        );
        console.log("login data", loginData);

      const updatedStudent = await students.updateMany(
        { studentId: studentId },
        { $set: studentDataWithoutMail }
      );
  
      if (updatedStudent.nModified === 0) {
        return res
          .status(404)
          .json({ message: "No items found matching the criteria" });
      }
  
      res.status(200).json({
        error: false,
        status: 200,
        message: "Student updated successfully",
      });
    }
    else {
      res.status(200).json({
        error: false,
        status: 301,
        message: "Email id is already exist",
      });
    }
   } else {
        const loginData = await logins.updateMany(
          { id: studentId },
          { $set: Login }
        );
        console.log("login data", loginData);
  
        const updatedStudent = await students.updateMany(
          { studentId: studentId },
          { $set: studentData }
        );
  
        if (updatedStudent.nModified === 0) {
          return res
            .status(404)
            .json({ message: "No items found matching the criteria" });
        }
  
        res.status(200).json({
          error: false,
          status: 200,
          message: "Student updated successfully",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: true,
        status: 500,
        message: "Internal server error",
        error: err.message,
      });
    }
  };

  const getStudentsById = async (req, res) => {
    // Define your GET route to retrieve items by data criteria
    const studentIdToFind = req.params.id;
  
    console.log(studentIdToFind);
  
    try {
      // Use Mongoose to find items that match the criteria
      const items = await students.find({studentId: studentIdToFind });
  
      if (!items || items.length === 0) {
        return res
          .status(404)
          .json({ message: "No data found matching the criteria" });
      }
  
      return res.status(200).json({
        error: false,
        status: 200,
        message: "Student are found",
        data: items,
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        status: 500,
        message: "Internal server error",
        error: err.message,
      });
    }
  };

  const getStudentByUniqueId = async (req, res) => {
    // Define your GET route to retrieve items by data criteria
    const IDToFind = req.params.id;
  
    console.log(IDToFind);
  
    try {
      // Use Mongoose to find items that match the criteria
      const items = await students.find({ UniqueId: IDToFind });
  
      if (!items || items.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No data found matching the criteria",
        });
      }
  
      return res.status(200).json({
        error: false,
        status: 200,
        message: "Students are found",
        data: items,
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        status: 500,
        message: "Internal server error",
        details: err.message,
      });
    }
  };

  
  const getStudentByInstituteUniqueId = async (req, res) => {
    // Define your GET route to retrieve items by data criteria
    const IDToFind = req.params.id;

    console.log(IDToFind);

    try {
      // Use Mongoose to find items that match the criteria
      const items = await students.find({ instituteUniqueId: IDToFind });

      if (!items || items.length === 0) {
        return res
          .status(404)
          .json({
            status: 404,
            message: "No data found matching the criteria",
          });
      }

      return res.status(200).json({
        error: false,
        status: 200,
        message: "Students are found",
        data: items,
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        status: 500,
        message: "Internal server error",
        details: err.message,
      });
    }
  };

  module.exports = {
    getStudents,
    createStudents,
    updateStatusStudent,
    deleteStudent,
    deleteStudentLogin,
    updateStudent,
    getStudentsById,
    getStudentByUniqueId,
    getStudentByInstituteUniqueId
  };
  