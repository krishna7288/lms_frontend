const branches = require("../models/Branch");
const logins = require("../models/Login");
const bcrypt = require("bcryptjs");

const getBranches = async (req, res) => {
  try {
    const data = await branches.find();
    res.status(200).json({
      error: false,
      status: 200,
      message: "Branches are found",
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

const createBranches = async (req, res) => {
  const file = req.files;

  console.log(req.body);

  console.log(file[0].filename);
  const password = req.body.password;

  console.log(password);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const branchData = {
      uploadBranchLogo: file[0].filename,
      branchId: req.body.branchId,
      branchName: req.body.branchName,
      branchType: req.body.branchType,
      pointOFContact: req.body.pointOFContact,
      landlineNumber: req.body.landlineNumber,
      mobileNumber: req.body.mobileNumber,
      emailId: req.body.emailId,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      area: req.body.area,
      pincode: req.body.pincode,
      country: req.body.country,
      state: req.body.state,
      district: req.body.district,
      cloudSpace: req.body.cloudSpace,
      cloudSpaceType: req.body.cloudSpaceType,
      vrEnabled: req.body.vrEnabled,
      password: hashedPassword,
      UniqueId: req.body.UniqueId,
      instituteUniqueId: req.body.instituteUniqueId,
    };

    const response = await logins.find({ emailId: req.body.emailId });

    const idResponse = await logins.find({ id: req.body.branchId });

    const Login = {
      id: req.body.branchId,
      emailId: req.body.emailId,
      password: hashedPassword,
      role: 5,
      status: 1,
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
        message: "Branch ID is already exist",
      });
    } else {
      const loginData = new logins(Login);
      await loginData.save();
      console.log(loginData);

      const data = new branches(branchData);
      await data.save();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Branch created successfully",
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
const updateStatusBranch = async (req, res) => {
  console.log("update", req.body);

  const branchId = req.params.id;
  console.log(branchId);

  try {

    const updatedBranch = await branches.updateOne(
      { branchId: branchId },
      { $set: { status: req.body.status } }
    );

    if (!updatedBranch) {
      return res.status(404).json({ message: "Branches are not found" });
    }
    const loginData = await logins.updateOne(
      { id: branchId },
      { $set: { status: req.body.status } }
    );
    console.log(loginData);

    res.status(200).json({
      error: false,
      status: 200,
      message: "Branch updated successfully",
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

const deleteBranch = async (req, res) => {
  try {
    const branchId = req.params.id;

    // Use Mongoose to find the document by ID and update it
    const deletedBranch = await branches.findByIdAndRemove(branchId);

    if (!deletedBranch) {
      return res.status(404).json({ message: "Branches are not found" });
    }

    res.status(200).json({
      error: false,
      status: 200,
      message: "Branch deleted successfully",
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

const deleteBranchLogin = async (req, res) => {
  try {
    const branchId = req.params.id;
    // Use Mongoose to find the document by ID and update it
    const deletedBranch = await logins.findOneAndDelete({ id: branchId });

    if (!deletedBranch) {
      return res.status(404).json({ message: "Branches are not found" });
    }
    res.status(200).json({
      error: false,
      status: 200,
      message: "Branch login deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      details: err.message,
    });
  }
};

const updateBranch = async (req, res) => {
  console.log("update", req.body);

  const file = req.files;

  const password = req.body.password;
  console.log(req.body.uploadBranchLogo);

  const ImageCheck = await branches.find({
    uploadBranchLogo: req.body.uploadBranchLogo,
  });

  // console.log(ImageCheck.length >= 1);

  const branchId = req.params.id;

  // console.log(branchId)

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const passwordHashCheck = await logins.find({ password: req.body.password });

  const branchData = {
    uploadBranchLogo: ImageCheck.length >= 1 ? req.body.uploadBranchLogo : file[0].filename,
    branchId: req.body.branchId,
    branchName: req.body.branchName,
    branchType: req.body.branchType,
    pointOFContact: req.body.pointOFContact,
    landlineNumber: req.body.landlineNumber,
    mobileNumber: req.body.mobileNumber,
    emailId: req.body.emailId,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    area: req.body.area,
    pincode: req.body.pincode,
    country: req.body.country,
    state: req.body.state,
    district: req.body.district,
    cloudSpace: req.body.cloudSpace,
    cloudSpaceType: req.body.cloudSpaceType,
    vrEnabled: req.body.vrEnabled,
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
  };

  console.log(req.body.vrEnabled, req.body.branchId)
  
  const branchDataWithoutMail = {
    uploadBranchLogo:
      ImageCheck.length >= 1 ? req.body.uploadBranchLogo : file[0].filename,
    branchId: req.body.branchId,
    branchName: req.body.branchName,
    branchType: req.body.branchType,
    pointOFContact: req.body.pointOFContact,
    landlineNumber: req.body.landlineNumber,
    mobileNumber: req.body.mobileNumber,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    area: req.body.area,
    pincode: req.body.pincode,
    country: req.body.country,
    state: req.body.state,
    district: req.body.district,
    cloudSpace: req.body.cloudSpace,
    cloudSpaceType: req.body.cloudSpaceType,
    vrEnabled: req.body.vrEnabled,
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
  };

  const loginWithoutMail = {
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
  };

  const Login = {
    emailId: req.body.emailId,
    password:
      passwordHashCheck.length === 1 ? req.body.password : hashedPassword,
  };

  try {
    const response = await logins.find({ emailId: req.body.emailId });

    if (response.length === 1) {
      const response1 = await logins.findOne({ emailId: req.body.emailId });

      if (response1.id === req.body.branchId) {
        const loginData = await logins.updateMany(
          { id: branchId },
          { $set: loginWithoutMail }
        );
        console.log("login data", loginData);

        const updatedBranch = await branches.updateMany(
          { branchId: branchId },
          { $set: branchDataWithoutMail }
        );

        // console.log("updated branch",updatedBranch)

        if (updatedBranch.nModified === 0) {
          return res
            .status(404)
            .json({ message: "No items found matching the criteria" });
        }

        res.status(200).json({
          error: false,
          status: 200,
          message: "Branch updated successfully",
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
        { id: branchId },
        { $set: Login }
      );
      console.log("login data", loginData);

      const updatedBranch = await branches.updateMany(
        { branchId: branchId },
        { $set: branchData }
      );

      // console.log("updated branch",updateBranch)

      if (updatedBranch.nModified === 0) {
        return res
          .status(404)
          .json({ message: "No items found matching the criteria" });
      }

      res.status(200).json({
        error: false,
        status: 200,
        message: "Branch updated successfully",
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

const getBranchesById = async (req, res) => {
  // Define your GET route to retrieve items by data criteria
  const branchIdToFind = req.params.id;

  console.log(branchIdToFind);

  try {
    // Use Mongoose to find items that match the criteria
    const items = await branches.find({ branchId: branchIdToFind });

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found matching the criteria" });
    }

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Branches are found",
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

 const getBranchByUniqueId = async (req, res) => {
   // Define your GET route to retrieve items by data criteria
   const IDToFind = req.params.id;

   console.log(IDToFind);

   try {
     // Use Mongoose to find items that match the criteria
     const items = await branches.find({ UniqueId: IDToFind });

     if (!items || items.length === 0) {
       return res.status(404).json({
         status: 404,
         message: "No data found matching the criteria",
       });
     }

     return res.status(200).json({
       error: false,
       status: 200,
       message: "Branches are found",
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

 const getBranchByInstituteUniqueId = async (req, res) => {
   // Define your GET route to retrieve items by data criteria
   const IDToFind = req.params.id;

   console.log(IDToFind);

   try {
     // Use Mongoose to find items that match the criteria
     const items = await branches.find({ instituteUniqueId: IDToFind });

     if (!items || items.length === 0) {
       return res.status(404).json({
         status: 404,
         message: "No data found matching the criteria",
       });
     }

     return res.status(200).json({
       error: false,
       status: 200,
       message: "Branches are found",
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
  getBranches,
  createBranches,
  updateStatusBranch,
  deleteBranch,
  updateBranch,
  deleteBranchLogin,
  getBranchesById,
  getBranchByUniqueId,
  getBranchByInstituteUniqueId
};
