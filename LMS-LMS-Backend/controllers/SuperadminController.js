// // controllers/userController.js
const bcrypt = require("bcryptjs");
const superadmins = require("../models/Superadmin");
const logins = require("../models/Login");

const getSuperadmin = async (req, res) => {
  try {
    const data = await superadmins.find();
    res.status(200).json({
      error: false,
      status: 200,
      message: "Superadmins are found",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const createSuperadmin = async (req, res) => {
  const password = req.body.password;

  console.log(password);

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const superadminData = {
      name: req.body.name,
      emailId: req.body.emailId,
      password: hashedPassword,
    };

    const data = new superadmins(superadminData);
    await data.save();
    res.status(200).json({
      error: false,
      status: 200,
      message: "Superadmin created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }

  const Login = {
    id:'superadmin01',
    name:req.body.name,
    emailId: req.body.emailId,
    password: hashedPassword,
    role:1,
    status:1
  };

  const loginData = new logins(Login);
  await loginData.save();
  console.log(loginData);

};

module.exports = {
  getSuperadmin,
  createSuperadmin,
};
