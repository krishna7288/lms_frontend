const faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const logins = require("../models/Login");

const getFaculty = async (req, res) => {
    try {
      const data = await faculty.find();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Faculty found",
        data: data,
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
  const createFaculty = async (req, res) => {
    
      const file = req.files;

      console.log(req.body)
  
      console.log(file[0].filename);
     
      const password = req.body.password;

      console.log(password);
 
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      try {
      const facultyData = {
        uploadProfile: file[0].filename,
        facultyId: req.body.facultyId,
        facultyName: req.body.facultyName,
        employeecode: req.body.employeecode,
        designation: req.body.designation,
        qualification: req.body.qualification,
        mobileNumber: req.body.mobileNumber,
        emailId: req.body.emailId,
        gender: req.body.gender,
        dob: req.body.dob,
        yoj: req.body.yoj,
        description: req.body.description,
        password: hashedPassword,
        bloodGroup: req.body.bloodGroup,
        UniqueId: req.body.UniqueId,
        instituteUniqueId: req.body.instituteUniqueId,
      };
  
      console.log(facultyData);

      const response = await logins.find({emailId:req.body.emailId});
      const idResponse = await logins.find({id:req.body.facultyId});
  
      const Login = {
        id: req.body.facultyId,
        emailId: req.body.emailId,
        password: hashedPassword,
        role: 7,
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
          message: "Faculty ID is already exist",
        });
      } else {
        const loginData = new logins(Login);
        await loginData.save();
        console.log(loginData);

      const data = new faculty(facultyData);
      await data.save();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Faculty created successfully",
        data: data,
      });
    } 
  }catch (err) {
      console.log(err.message);
      res.status(500).json({
        error: true,
        status: 500,
        message: "Internal server error",
        details: err.message,
      });
    }
  };
  
  const updateStatusFaculty = async (req, res) => {
    console.log("update", req.body);

    const facultyId = req.params.id;
    console.log(facultyId);

    try {
      // const updateData = {
      //   status: req.body.status,
      // };
  
      // // Use Mongoose to find the document by ID and update it
      // const updatedFaculty = await faculty.findByIdAndUpdate(
      //   facultyId,
      //   updateData
      // );
      const updatedFaculty = await faculty.updateOne(
        {facultyId:facultyId},
        {$set:{status:req.body.status}}
        )
  
      if (!updatedFaculty) {
        return res.status(404).json({ message: "Faculty not found" });
      }
      const loginData = await logins.updateOne(
        { id : facultyId },
        { $set: { status: req.body.status } }
      );
      console.log(loginData);

      res.status(200).json({
        error: false,
        status: 200,
        message: "Faculty updated successfully",
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

  const deleteFaculty = async (req, res) => {
    try {
      const facultyId = req.params.id;
  
      // Use Mongoose to find the document by ID and update it
      const deletedFaculty= await faculty.findByIdAndRemove(facultyId);
  
      if (!deletedFaculty) {
        return res.status(404).json({ message: "Faculty not found" });
      }
  
      res.status(200).json({
        error: false,
        status: 200,
        message: "Faculty deleted successfully",
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
  const deleteFacultyLogin = async (req, res) => {
    try {
      const facultyId = req.params.id;
      // Use Mongoose to find the document by ID and update it
      const deletedFaculty = await logins.findOneAndDelete({ id : facultyId});
  
      if (!deletedFaculty) {
        return res.status(404).json({ message: "Facultys are not found" });
      }
      res.status(200).json({
        error: false,
        status: 200,
        message: "Faculty login deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        details: err.message,
      });
    }
  };

  const updateFaculty= async (req, res) => {
    console.log("update", req.body);
  
    const file = req.files;
  
  console.log(req.body.uploadProfile)

  const ImageCheck = await faculty.find({uploadProfile : req.body.uploadProfile})

  console.log(ImageCheck.length >= 1)

    const password = req.body.password;

    console.log( req.body.qualification);

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
  
    const facultyId = req.params.id;
    const passwordHashCheck = await logins.find({ password: req.body.password });

  
    const facultyData = {
      uploadProfile:
        ImageCheck.length >= 1 ? req.body.uploadProfile : file[0].filename,
      facultyId: req.body.facultyId,
      facultyName: req.body.facultyName,
      employeecode: req.body.employeecode,
      designation: req.body.designation,
      qualification: req.body.qualification,
      mobileNumber: req.body.mobileNumber,
      emailId: req.body.emailId,
      gender: req.body.gender,
      dob: req.body.dob,
      yoj: req.body.yoj,
      description: req.body.description,
      password:
        passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
      bloodGroup: req.body.bloodGroup,
     
    };

      const facultyDataWithoutMail = {
        uploadProfile:
          ImageCheck.length >= 1 ? req.body.uploadProfile : file[0].filename,
        facultyId: req.body.facultyId,
        facultyName: req.body.facultyName,
        employeecode: req.body.employeecode,
        designation: req.body.designation,
        qualification: req.body.qualification,
        mobileNumber: req.body.mobileNumber,
        gender: req.body.gender,
        dob: req.body.dob,
        yoj: req.body.yoj,
        description: req.body.description,
        password:
          passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
        bloodGroup: req.body.bloodGroup,
       
      };
      const loginWithoutMail = {
        password: passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
      }

      const Login = {
        emailId: req.body.emailId,
        password: passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
      };
     
    try {
      const response = await logins.find({ emailId: req.body.emailId });
      if (response.length === 1) {
        const response1 = await logins.findOne({emailId:req.body.emailId});
       
        if(response1.id=== req.body.facultyId){
        const loginData = await logins.updateMany(
          { id:facultyId },
          { $set: loginWithoutMail}
        );
        console.log("login data", loginData);
  
        const updatedFaculty = await faculty.updateMany(
          { facultyId: facultyId },
          { $set: facultyDataWithoutMail}
        );
     
      if (updatedFaculty.nModified === 0) {
        return res
          .status(404)
          .json({ message: "No items found matching the criteria" });
      }
  
      res.status(200).json({
        error: false,
        status: 200,
        message: "Faculty updated successfully",
      });
    }else {
      res.status(200).json({
        error: false,
        status: 301,
        message: "Email id is already exist",
      });
    }
  }else {
        const loginData = await logins.updateMany(
          { id: facultyId },
          { $set: Login}
        );
        console.log("login data", loginData);
  
        const updatedFaculty = await faculty.updateMany(
          { facultyId: facultyId },
          { $set: facultyData}
        );
  
        if (updatedFaculty.nModified === 0) {
          return res
            .status(404)
            .json({ message: "No items found matching the criteria" });
        }
  
        res.status(200).json({
          error: false,
          status: 200,
          message: "Faculty updated successfully",
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

  const getFacultyById = async (req, res) => {
    // Define your GET route to retrieve items by data criteria
    const facultyIdToFind = req.params.id;
  
    console.log(facultyIdToFind);
  
    try {
      // Use Mongoose to find items that match the criteria
      const items = await faculty.find({facultyId: facultyIdToFind });
  
      if (!items || items.length === 0) {
        return res
          .status(404)
          .json({ message: "No data found matching the criteria" });
      }
  
      return res.status(200).json({
        error: false,
        status: 200,
        message: "Faculty found",
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

  const getFacultyByUniqueId = async (req, res) => {
    // Define your GET route to retrieve items by data criteria
    const IDToFind = req.params.id;
  
    console.log(IDToFind);
  
    try {
      // Use Mongoose to find items that match the criteria
      const items = await faculty.find({ UniqueId: IDToFind });
  
      if (!items || items.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No data found matching the criteria",
        });
      }
  
      return res.status(200).json({
        error: false,
        status: 200,
        message: "Institutes are found",
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

  
  const getFacultyByInstituteUniqueId = async (req, res) => {
    // Define your GET route to retrieve items by data criteria
    const IDToFind = req.params.id;

    console.log(IDToFind);

    try {
      // Use Mongoose to find items that match the criteria
      const items = await faculty.find({ instituteUniqueId: IDToFind });

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
        message: "Institutes are found",
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
    getFaculty,
    createFaculty,
    updateStatusFaculty,
    deleteFaculty,
    deleteFacultyLogin,
    updateFaculty,
    getFacultyById,
    getFacultyByUniqueId,
    getFacultyByInstituteUniqueId
  };
  

  