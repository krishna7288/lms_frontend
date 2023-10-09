// controllers/adminController.js
const branchAdmins = require("../models/BranchAdmin");
const bcrypt = require("bcryptjs");
const logins = require("../models/Login");

const getBranchAdmins = async (req, res) => {
  try {
    const data = await branchAdmins.find();
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

const createBranchAdmin = async (req, res) => {
  
    const file = req.files;

    console.log(file[0].filename);

     const password = req.body.password;

     console.log(password);

     const salt = bcrypt.genSaltSync(10);
     const hashedPassword = bcrypt.hashSync(password, salt);
     try {
    const branchAdminData = {
      uploadProfilePic: file[0].filename,
      branchAdminId:req.body.branchAdminId,
      name: req.body.name,
      emailId: req.body.emailId,
      password: hashedPassword,
      mobileNumber: req.body.mobileNumber,
      permission: {
        add: req.body.permissionAdd,
        edit: req.body.permissionEdit,
        delete: req.body.permissionDelete,
      },
      branchUniqueId: req.body.branchUniqueId,
    };

    const response = await logins.find({ emailId: req.body.emailId });

      const idResponse = await logins.find({ id: req.body.branchAdminId});
  
      const Login = {
        id: req.body.branchAdminId,
        emailId: req.body.emailId,
        password: hashedPassword,
        role: 6,
        status: 1,
        permission: {
          add: req.body.permissionAdd,
          edit: req.body.permissionEdit,
          delete: req.body.permissionDelete,
        },
        branchUniqueId: req.body.branchUniqueId,
      };
  
      if (response.length === 1) {
        return res.json({
          status: 301,
          message: "Email ID is already exist",
        });
      } else if (idResponse.length === 1) {
        return res.json({
          status: 301,
          message: "BranchAdmin ID is already exist",
        });
      } else {
    const data = new branchAdmins(branchAdminData);
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
    console.log(err.message);
    res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error",
     details: err.message,
    });
  }
};

const updateStatusByBranchAdmin = async (req, res) => {
  console.log("update", req.body);

  try {
    const branchAdminId = req.params.id;
   

    // Use Mongoose to find the document by ID and update it
    const updatedBranch = await branchAdmins.updateOne(
      {branchAdminId:branchAdminId},
      {$set:{status:req.body.status}}
    );

    if (!updatedBranch) {
      return res.status(404).json({ message: "Admins are not found" });
    }

    const loginData = await logins.updateOne(
      { id : branchAdminId },
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

const deleteBranchAdmin = async (req, res) => {
  try {
    const branchAdminId = req.params.id;

    // Use Mongoose to find the document by ID and update it
    const deletedBranchAdmin = await branchAdmins.findByIdAndRemove(branchAdminId);

    if (!deletedBranchAdmin) {
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

const deleteBranchAdminLogin = async (req, res) => {
  try {
    const branchAdminId= req.params.id;

    console.log(branchAdminId)

    // Use Mongoose to find the document by ID and update it
    const deletedBranchAdmin = await logins.findOneAndDelete({id : branchAdminId});

    if (!deletedBranchAdmin) {
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

const updateBranchAdmin = async (req, res) => {
  console.log("update", req.body);

  const file = req.files;

  console.log(file);

  const branchAdminId = req.params.id;

  const password = req.body.password;

  console.log(password);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const ImageCheck = await branchAdmins.find({
    uploadProfilePic: req.body.uploadProfilePic,
  });
  const passwordHashCheck = await logins.find({ password: req.body.password });

  const branchAdminData = {
    uploadProfilePic:  ImageCheck.length >= 1 ? req.body.uploadProfilePic : file[0].filename,
    branchAdminId:req.body.branchAdminId,
    name: req.body.name,
    emailId: req.body.emailId,
    password:passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    mobileNumber: req.body.mobileNumber,
    permission: {
      add: req.body.permissionAdd,
      edit: req.body.permissionEdit,
      delete: req.body.permissionDelete,
    },
  };
  const branchAdminDataWithoutMail = {
    uploadProfilePic:ImageCheck.length >= 1 ? req.body.uploadProfilePic : file[0].filename,
    branchAdminId:req.body.branchAdminId,
    name: req.body.name,
    password:passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    mobileNumber: req.body.mobileNumber,
    permission: {
      add: req.body.permissionAdd,
      edit: req.body.permissionEdit,
      delete: req.body.permissionDelete,
    },
  };
  const Login = {
    emailId: req.body.emailId,
    password:passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    permission: {
      add: req.body.permissionAdd,
      edit: req.body.permissionEdit,
      delete: req.body.permissionDelete,
    },
  };
  
  const loginWithoutMail = {
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
    permissions: {
      add: req.body.permissionAdd,
      edit: req.body.ipermissionEdit,
      delete: req.body.permissionDelete,
    },
  };

  
  try {
    const response = await logins.find({ emailId: req.body.emailId });

    if (response.length === 1) {
      const response1 = await logins.findOne({ emailId: req.body.emailId });

      if (response1.id === req.body.branchAdminId) {
      
    // Use Mongoose to find the document by ID and update it
    const updatedBranchAdmin = await branchAdmins.updateMany(
      {branchAdminId: branchAdminId },
      { $set:branchAdminDataWithoutMail }
    );
    const loginData = await logins.updateMany(
      { id: branchAdminId },
      { $set: loginWithoutMail }
    );
    console.log("login data", loginData);

    if (updatedBranchAdmin.nModified === 0) {
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
   else {
        res.status(200).json({
          error: false,
          status: 301,
          message: "Email id is already exist",
        });
      }
    } else {
      // Use Mongoose to find the document by ID and update it
      const updatedBranchAdmin = await branchAdmins.updateMany(
        { branchAdminId: branchAdminId },
        { $set: branchAdminData }
      );
      const loginData = await logins.updateMany(
        { id: branchAdminId },
        { $set: Login }
      );
      console.log("login data", loginData);

      // Use Mongoose to find the document by ID and update it

      if (updatedBranchAdmin.nModified === 0) {
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

const getBranchAdminById = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const branchAdminIdToFind = req.params.id;

  // console.log("branchid : ",branchAdminIdToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const data = await branchAdmins.find({ branchAdminId: branchAdminIdToFind });

    // console.log("data",data.length)

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

const getBranchAdminByBranchUniqueId = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const IDToFind = req.params.id;

  console.log(IDToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await branchAdmins.find({ branchUniqueId: IDToFind });

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
      message: "Admins are found",
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
  getBranchAdmins,
  createBranchAdmin,
  updateStatusByBranchAdmin,
  deleteBranchAdmin,
  deleteBranchAdminLogin,
  updateBranchAdmin,
  getBranchAdminById,
  getBranchAdminByBranchUniqueId
};
