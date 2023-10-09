// controllers/userController.js
const institutes = require("../models/Institute");
const logins = require("../models/Login");
const bcrypt = require("bcryptjs");

const getInstitutes = async (req, res) => {
  try {
    const data = await institutes.find();
    res.status(200).json({
      error: false,
      status: 200,
      message: "Institutes are found",
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

const createInstitutes = async (req, res) => {
  const file = req.files;

  // console.log(file[0].filename);

  const password = req.body.password;

  console.log(password);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const instituteData = {
      uploadInstituteLogo: file[0].filename,
      instituteID: req.body.instituteID,
      instituteName: req.body.instituteName,
      instituteType: req.body.instituteType,
      pointOFContact: req.body.pointOFContact,
      landlineNumber: req.body.landlineNumber,
      mobileNumber: req.body.mobileNumber,
      emailId: req.body.emailId,
      password: hashedPassword,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      area: req.body.area,
      pinCode: req.body.pinCode,
      country: req.body.country,
      state: req.body.state,
      district: req.body.district,
      numberOfBranches: req.body.numberOfBranches,
      numberOfStudents: req.body.numberOfStudents,
      numberOfFaculties: req.body.numberOfFaculties,
      cloudSpace: req.body.cloudSpace,
      cloudSpaceType: req.body.cloudSpaceType,
      vrEnabled: req.body.vrEnabled,
      UniqueId:req.body.UniqueId
    };

    const response = await logins.find({ emailId: req.body.emailId });

    const idResponse = await logins.find({ id: req.body.instituteID });

    const Login = {
      id: req.body.instituteID,
      emailId: req.body.emailId,
      password: hashedPassword,
      role: 3,
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
        message: "Institute ID is already exist",
      });
    } else {
      const loginData = new logins(Login);
      await loginData.save();
      console.log(loginData);

      const data = new institutes(instituteData);
      await data.save();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Institute created successfully",
        data: data,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
      details: err.message,
    });
  }
};

const updateStatusByInstitute = async (req, res) => {
  console.log("update", req.body.status);

  const instituteId = req.params.id;
  console.log(instituteId);

  try {
    // Use Mongoose to find the document by ID and update it
    // const updatedInstitute = await institutes.updateOne(
    //   { emailId: instituteId },
    //   { $set: { status: req.body.status } }
    // );

    const updatedInstitute = await institutes.updateOne(
      { instituteID: instituteId },
      { $set: { status: req.body.status } }
    );

    if (!updatedInstitute) {
      return res.status(404).json({ message: "Institutes are not found" });
    }

    const loginData = await logins.updateOne(
      { id : instituteId },
      { $set: { status: req.body.status } }
    );
    console.log(loginData);

    res.status(200).json({
      error: false,
      status: 200,
      message: "Institute updated successfully",
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

const deleteInstitute = async (req, res) => {
  try {
    const instituteId = req.params.id;

    // Use Mongoose to find the document by ID and update it
    const deletedInstitute = await institutes.findByIdAndDelete(instituteId);

    if (!deletedInstitute) {
      return res.status(404).json({ message: "Institutes are not found" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Institute deleted successfully",
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

const deleteInstituteLogin = async (req, res) => {
  try {
    const instituteId = req.params.id;
    // Use Mongoose to find the document by ID and update it
    const deletedInstitute = await logins.findOneAndDelete({ id: instituteId });

    if (!deletedInstitute) {
      return res.status(404).json({ message: "Institutes are not found" });
    }
    res.status(200).json({
      error: false,
      status: 200,
      message: "Institute login deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      details: err.message,
    });
  }
};

const updateInstitute = async (req, res) => {
  console.log("update", req.body);

  const file = req.files;

  // console.log(file);

  console.log(req.body.uploadInstituteLogo)

  const ImageCheck = await institutes.find({uploadInstituteLogo : req.body.uploadInstituteLogo})

  console.log(ImageCheck.length >= 1)

  const instituteId = req.params.id;

  const password = req.body.password;

  console.log(password);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // To check the Password is already hashed if it hashed means it will update the data with new password
  const passwordHashCheck = await logins.find({ password: req.body.password });

  const instituteData = {
    uploadInstituteLogo: ImageCheck.length >= 1 ? req.body.uploadInstituteLogo : file[0].filename,
    instituteID: req.body.instituteID,
    instituteName: req.body.instituteName,
    instituteType: req.body.instituteType,
    pointOFContact: req.body.pointOFContact,
    landlineNumber: req.body.landlineNumber,
    mobileNumber: req.body.mobileNumber,
    emailId: req.body.emailId,
    password: passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    area: req.body.area,
    pinCode: req.body.pinCode,
    country: req.body.country,
    state: req.body.state,
    district: req.body.district,
    numberOfBranches: req.body.numberOfBranches,
    numberOfStudents: req.body.numberOfStudents,
    numberOfFaculties: req.body.numberOfFaculties,
    cloudSpace: req.body.cloudSpace,
    cloudSpaceType: req.body.cloudSpaceType,
    vrEnabled: req.body.vrEnabled,
  };

  const instituteDataWithoutMail = {
    uploadInstituteLogo: ImageCheck.length >= 1 ? req.body.uploadInstituteLogo : file[0].filename,
    instituteID: req.body.instituteID,
    instituteName: req.body.instituteName,
    instituteType: req.body.instituteType,
    pointOFContact: req.body.pointOFContact,
    landlineNumber: req.body.landlineNumber,
    mobileNumber: req.body.mobileNumber,
    password: passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    area: req.body.area,
    pinCode: req.body.pinCode,
    country: req.body.country,
    state: req.body.state,
    district: req.body.district,
    numberOfBranches: req.body.numberOfBranches,
    numberOfStudents: req.body.numberOfStudents,
    numberOfFaculties: req.body.numberOfFaculties,
    cloudSpace: req.body.cloudSpace,
    cloudSpaceType: req.body.cloudSpaceType,
    vrEnabled: req.body.vrEnabled,
  };

  const loginWithoutMail = {
    password: passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
  };

  const Login = {
    emailId: req.body.emailId,
    password: passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
  };

 
  try {
    //To check the email id is already exist if it exist means it will update the data without email id
    const response = await logins.find({ emailId: req.body.emailId });

      if (response.length === 1) {

        const response1 = await logins.findOne({ emailId: req.body.emailId });

        if (response1.id === req.body.instituteID) {
          const loginData = await logins.updateMany(
            { id: instituteId },
            { $set: loginWithoutMail }
          );

          console.log("login data", loginData);

          const updatedInstitute = await institutes.updateMany(
            { instituteID: instituteId },
            { $set: instituteDataWithoutMail }
          );

          if (updatedInstitute.nModified === 0) {
            return res
              .status(404)
              .json({ message: "No items found matching the criteria" });
          }

          res.status(200).json({
            error: false,
            status: 200,
            message: "Institute updated successfully",
          });
        } else {
          res.status(200).json({
            error: false,
            status: 301,
            message: "Email id is already exist",
          });
        }
      } else {
        const loginData = await logins.updateMany(
          { id: instituteId },
          { $set: Login }
        );
        console.log("login data", loginData);

        const updatedInstitute = await institutes.updateMany(
          { instituteID: instituteId },
          { $set: instituteData }
        );

        if (updatedInstitute.nModified === 0) {
          return res
            .status(404)
            .json({ message: "No items found matching the criteria" });
        }

        res.status(200).json({
          error: false,
          status: 200,
          message: "Institute updated successfully",
        });
      }

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

const getInstitutesById = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const instituteIDToFind = req.params.id;

  console.log(instituteIDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await institutes.find({ instituteID: instituteIDToFind });

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found matching the criteria" });
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

const getInstitutesByUniqueId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await institutes.find({ UniqueId: IDToFind });

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found matching the criteria" });
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
  getInstitutes,
  createInstitutes,
  updateStatusByInstitute,
  deleteInstitute,
  updateInstitute,
  getInstitutesById,
  deleteInstituteLogin,
  getInstitutesByUniqueId
};
