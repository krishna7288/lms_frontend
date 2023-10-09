// controllers/adminController.js
const instituteAdmins = require("../models/InstituteAdmin");
const bcrypt = require("bcryptjs");
const logins = require("../models/Login");

const getInstituteAdmins = async (req, res) => {
  try {
    const data = await instituteAdmins.find();
    res.status(200).json({
      error: false,
      status: 200,
      message: "Admins are found",
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

const createInstituteAdmin = async (req, res) => {
  const file = req.files;

  console.log(file[0].filename);

  const password = req.body.password;

  console.log(password);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const instituteAdminData = {
      uploadProfilePic: file[0].filename,
      instituteAdminId: req.body.instituteAdminId,
      name: req.body.name,
      emailId: req.body.emailId,
      password: hashedPassword,
      mobileNumber: req.body.mobileNumber,
      permission: {
        add: req.body.permissionAdd,
        edit: req.body.permissionEdit,
        delete: req.body.permissionDelete,
      },
      instituteUniqueId: req.body.instituteUniqueId,
    };

    const response = await logins.find({ emailId: req.body.emailId });

    const idResponse = await logins.find({ id: req.body.instituteAdminId });

    const Login = {
      id: req.body.instituteAdminId,
      emailId: req.body.emailId,
      password: hashedPassword,
      role: 4,
      status: 1,
      permission: {
        add: req.body.permissionAdd,
        edit: req.body.permissionEdit,
        delete: req.body.permissionDelete,
      },
      instituteUniqueId: req.body.instituteUniqueId,
    };

    if (response.length === 1) {
      return res.json({
        status: 301,
        message: "Email ID is already exist",
      });
    } else if (idResponse.length === 1) {
      return res.json({
        status: 301,
        message: "InstituteAdmin ID is already exist",
      });
    } else {
      const data = new instituteAdmins(instituteAdminData);
      await data.save();
      res.status(200).json({
        error: false,
        status: 200,
        message: "InstituteAdmin created successfully",
        data: data,
      });
      const loginData = new logins(Login);
      await loginData.save();
      console.log(loginData);
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

const updateStatusByInstituteAdmin = async (req, res) => {
  console.log("update", req.body);

  try {
    const instituteAdminId = req.params.id;

    // Use Mongoose to find the document by ID and update it
    const updatedInstitute = await instituteAdmins.updateOne(
      { instituteAdminId: instituteAdminId },
      { $set: { status: req.body.status } }
    );

    if (!updatedInstitute) {
      return res.status(404).json({ message: "Admins are not found" });
    }

    const loginData = await logins.updateOne(
      { id: instituteAdminId },
      { $set: { status: req.body.status } }
    );
    console.log(loginData);

    res.status(200).json({
      error: false,
      status: 200,
      message: "Admin updated successfully",
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

const deleteInstituteAdmin = async (req, res) => {
  try {
    const instituteAdminId = req.params.id;

    // Use Mongoose to find the document by ID and update it
    const deletedInstituteAdmin = await instituteAdmins.findByIdAndRemove(
      instituteAdminId
    );

    if (!deletedInstituteAdmin) {
      return res.status(404).json({ message: "Admins are not found" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Admin deleted successfully",
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

const deleteInstituteAdminLogin = async (req, res) => {
  try {
    const instituteAdminId = req.params.id;

    console.log(instituteAdminId);

    // Use Mongoose to find the document by ID and update it
    const deletedInstituteAdmin = await logins.findOneAndDelete({
      id: instituteAdminId,
    });

    if (!deletedInstituteAdmin) {
      return res.status(404).json({ message: "Admins are not found" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Admin Login deleted successfully",
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

const updateInstituteAdmin = async (req, res) => {
  console.log("update", req.body);

  const file = req.files;

  console.log(file);

  const instituteAdminId = req.params.id;

  const password = req.body.password;

  console.log(password);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const ImageCheck = await instituteAdmins.find({
    uploadProfilePic: req.body.uploadProfilePic,
  });
  const passwordHashCheck = await logins.find({ password: req.body.password });

  const instituteAdminData = {
    uploadProfilePic:
      ImageCheck.length >= 1 ? req.body.uploadProfilePic : file[0].filename,
    instituteAdminId: req.body.instituteAdminId,
    name: req.body.name,
    emailId: req.body.emailId,
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    mobileNumber: req.body.mobileNumber,
    permission: {
      add: req.body.permissionAdd,
      edit: req.body.permissionEdit,
      delete: req.body.permissionDelete,
    },
 
  };

  const instituteAdminDataWithoutMail = {
    uploadProfilePic:
      ImageCheck.length >= 1 ? req.body.uploadProfilePic : file[0].filename,
    instituteAdminId: req.body.instituteAdminId,
    name: req.body.name,
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    mobileNumber: req.body.mobileNumber,
    permission: {
      add: req.body.permissionAdd,
      edit: req.body.permissionEdit,
      delete: req.body.permissionDelete,
    },
  
  };
  
  const Login = {
    emailId: req.body.emailId,
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    permission: {
      add: req.body.permissionAdd,
      edit: req.body.permissionEdit,
      delete: req.body.permissionDelete,
    },
  
  };

  const loginWithoutMail = {
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    institute: {
      add: req.body.permissionAdd,
      edit: req.body.ipermissionEdit,
      delete: req.body.permissionDelete,
    },

  };

  try {
    const response = await logins.find({ emailId: req.body.emailId });

    if (response.length === 1) {
      const response1 = await logins.findOne({ emailId: req.body.emailId });

      if (response1.id === req.body.instituteAdminId) {
        // Use Mongoose to find the document by ID and update it
        const updatedInstituteAdmin = await instituteAdmins.updateMany(
          { instituteAdminId: instituteAdminId },
          { $set: instituteAdminDataWithoutMail }
        );
        const loginData = await logins.updateMany(
          { id: instituteAdminId },
          { $set: loginWithoutMail }
        );
        console.log("login data", loginData);

        if (updatedInstituteAdmin.nModified === 0) {
          return res
            .status(404)
            .json({ message: "No Data found matching the criteria" });
        }

        res.status(200).json({
          error: false,
          status: 200,
          message: "Admin updated successfully",
        });
      } else {
        res.status(200).json({
          error: false,
          status: 301,
          message: "Email id is already exist",
        });
      }
    } else {
      // Use Mongoose to find the document by ID and update it
      const updatedInstituteAdmin = await instituteAdmins.updateMany(
        { instituteAdminId: instituteAdminId },
        { $set: instituteAdminData }
      );
      const loginData = await logins.updateMany(
        { id: instituteAdminId },
        { $set: Login }
      );
      console.log("login data", loginData);

      // Use Mongoose to find the document by ID and update it

      if (updatedInstituteAdmin.nModified === 0) {
        return res
          .status(404)
          .json({ message: "No Data found matching the criteria" });
      }

      res.status(200).json({
        error: false,
        status: 200,
        message: "Admin updated successfully",
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

const getInstituteAdminById = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const instituteAdminIdToFind = req.params.id;

  console.log(instituteAdminIdToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const data = await instituteAdmins.find({
      instituteAdminId: instituteAdminIdToFind,
    });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found matching the criteria" });
    }

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Admin are found",
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

const getInstituteAdminByInstituteUniqueId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IdToFind = req.params.id;

  console.log(IdToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const data = await instituteAdmins.find({
      instituteUniqueId: IdToFind,
    });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "No data found matching the criteria" });
    }

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Admin are found",
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

module.exports = {
  getInstituteAdmins,
  createInstituteAdmin,
  updateStatusByInstituteAdmin,
  deleteInstituteAdmin,
  deleteInstituteAdminLogin,
  updateInstituteAdmin,
  getInstituteAdminById,
  getInstituteAdminByInstituteUniqueId,
};
