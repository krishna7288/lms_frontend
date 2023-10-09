// controllers/adminController.js
const admins = require("../models/Admin");
const logins = require("../models/Login");
const bcrypt = require("bcryptjs");

const getAdmins = async (req, res) => {
  try {
    const data = await admins.find();
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

const createAdmin = async (req, res) => {
  const password = req.body.password;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const file = req.files;

  console.log(file[0].filename);

  try {
    const adminData = {
      uploadProfilePic: file[0].filename,
      adminId: req.body.adminId,
      name: req.body.name,
      emailId: req.body.emailId,
      password: hashedPassword,
      mobileNumber: req.body.mobileNumber,
      permission: {
        add: req.body.permissionAdd,
        edit: req.body.permissionEdit,
        delete: req.body.permissionDelete,
      },
      reportGeneration: {
        add: req.body.reportGenerationAdd,
      },
    };

    const response = await logins.find({ emailId: req.body.emailId });

    const idResponse = await logins.find({ id: req.body.adminId });

    const Login = {
      id: req.body.adminId,
      emailId: req.body.emailId,
      password: hashedPassword,
      role: 2,
      status: 1,
      permission: {
        add: req.body.permissionAdd,
        edit: req.body.permissionEdit,
        delete: req.body.permissionDelete,
      },
      reportGeneration: {
        add: req.body.reportGenerationAdd,
      },
    };

    if (response.length === 1) {
      return res.json({
        status: 301,
        message: "Email ID is already exist",
      });
    } else if (idResponse.length === 1) {
      return res.json({
        status: 301,
        message: "Admin ID is already exist",
      });
    } else {
      const data = new admins(adminData);
      await data.save();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Admin created successfully",
        data: data,
      });
      const loginData = new logins(Login);
      await loginData.save();
      console.log(loginData);
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

const updateStatusByAdmin = async (req, res) => {
  console.log("update", req.body);

  try {
    const adminId = req.params.id;

    const updatedInstitute = await admins.updateOne(
      { adminId: adminId },
      { $set: { status: req.body.status } }
    );

    if (!updatedInstitute) {
      return res.status(404).json({ message: "Admins are not found" });
    }

    const loginData = await logins.updateOne(
      { id : adminId },
      { $set: { status: req.body.status } }
    );
    console.log(loginData);

    res.status(200).json({
      error: false,
      status: 200,
      message: "Admin updated successfully",
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

const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;

    // Use Mongoose to find the document by ID and update it
    const deletedAdmin = await admins.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
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

const deleteAdminLogin = async (req, res) => {
  try {
    const adminId = req.params.id;

    console.log(adminId);

    // Use Mongoose to find the document by ID and update it
    const deletedAdmin = await logins.findOneAndDelete({ id: adminId });

    if (!deletedAdmin) {
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

const updateAdmin = async (req, res) => {
  console.log("update", req.body);

  const file = req.files;

  console.log(file);

  const adminId = req.params.id;

  const password = req.body.password;

  console.log(password);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const ImageCheck = await admins.find({
    uploadProfilePic: req.body.uploadProfilePic,
  });

  // To check the Password is already hashed if it hashed means it will update the data with new password
  const passwordHashCheck = await logins.find({ password: req.body.password });

  const adminData = {
    uploadProfilePic:
      ImageCheck.length >= 1 ? req.body.uploadProfilePic : file[0].filename,
    adminId: req.body.adminId,
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
    reportGeneration: {
      add: req.body.reportGenerationAdd,
    },
  };

  const adminDataWithoutMail = {
    uploadProfilePic:
      ImageCheck.length >= 1 ? req.body.uploadProfilePic : file[0].filename,
    adminId: req.body.adminId,
    name: req.body.name,
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    mobileNumber: req.body.mobileNumber,
    permission: {
      add: req.body.permissionAdd,
      edit: req.body.permissionEdit,
      delete: req.body.permissionDelete,
    },
    reportGeneration: {
      add: req.body.reportGenerationAdd,
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
    reportGeneration: {
      add: req.body.reportGenerationAdd,
    },
  };

  const loginWithoutMail = {
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
      permission: {
        add: req.body.permissionAdd,
        edit: req.body.permissionEdit,
        delete: req.body.permissionDelete,
      },
    reportGeneration: {
      add: req.body.reportGenerationAdd,
    },
  };

  // const adminDataWithoutHashPassword = {
  //   uploadProfilePic: file[0].filename,
  //   adminId: req.body.adminId,
  //   name: req.body.name,
  //   emailId: req.body.emailId,
  //   password: req.body.password,
  //   mobileNumber: req.body.mobileNumber,
  //   institute: {
  //     add: req.body.instituteAdd,
  //     edit: req.body.instituteEdit,
  //     delete: req.body.instituteDelete,
  //   },
  //   reportGeneration: {
  //     add: req.body.reportGenerationAdd,
  //   },
  // };

  // const adminDataWithoutMailAndHashPassword = {
  //   uploadProfilePic: file[0].filename,
  //   adminId: req.body.adminId,
  //   name: req.body.name,
  //   password: req.body.password,
  //   mobileNumber: req.body.mobileNumber,
  //   institute: {
  //     add: req.body.instituteAdd,
  //     edit: req.body.instituteEdit,
  //     delete: req.body.instituteDelete,
  //   },
  //   reportGeneration: {
  //     add: req.body.reportGenerationAdd,
  //   },
  // };

  // const LoginWithoutHashPassword = {
  //   emailId: req.body.emailId,
  //   password: req.body.password,
  //   institute: {
  //     add: req.body.instituteAdd,
  //     edit: req.body.instituteEdit,
  //     delete: req.body.instituteDelete,
  //   },
  //   reportGeneration: {
  //     add: req.body.reportGenerationAdd,
  //   },
  // };

  // const LoginWithoutMailAndHashPassword = {
  //   password: req.body.password,
  //   institute: {
  //     add: req.body.instituteAdd,
  //     edit: req.body.instituteEdit,
  //     delete: req.body.instituteDelete,
  //   },
  //   reportGeneration: {
  //     add: req.body.reportGenerationAdd,
  //   },
  // };

  try {
    //To check the email id is already exist if it exist means it will update the data without email id
    const response = await logins.find({ emailId: req.body.emailId });

    if (response.length === 1) {
      const response1 = await logins.findOne({ emailId: req.body.emailId });

      if (response1.id === req.body.adminId) {
        // Use Mongoose to find the document by ID and update it
        const updatedAdmin = await admins.updateMany(
          { adminId: adminId },
          { $set: adminDataWithoutMail }
        );

        const loginData = await logins.updateMany(
          { id: adminId },
          { $set: loginWithoutMail }
        );
        console.log("login data", loginData);

        if (updatedAdmin.nModified === 0) {
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
      const updatedAdmin = await admins.updateMany(
        { adminId: adminId },
        { $set: adminData }
      );

      const loginData = await logins.updateMany(
        { id: adminId },
        { $set: Login }
      );
      console.log("login data", loginData);

      if (updatedAdmin.nModified === 0) {
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

const getAdminById = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const adminIdToFind = req.params.id;

  console.log(adminIdToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const data = await admins.find({ adminId: adminIdToFind });

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

module.exports = {
  getAdmins,
  createAdmin,
  updateStatusByAdmin,
  deleteAdmin,
  updateAdmin,
  getAdminById,
  deleteAdminLogin,
};
