const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logins = require("../models/Login");

let refreshTokens = [];

const LoginAuth = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // console.log(email, password);

  try {
    const generateAccessToken = () => {
      return jwt.sign({ id: response[0]._id }, "lmsjwtsecret", {
        expiresIn: "20m",
      });
    };

    const generateRefreshToken = () => {
      return jwt.sign({ id: response[0]._id }, "lmsrefreshjwtsecret", {
        expiresIn: "1d",
      });
    };

    const response = await logins.find({ emailId: email });

    console.log(response);

    // const validPass = bcrypt.compareSync(password, response[0].password);
    // console.log(validPass);

    if (email === "") {
      res.json({
        error: true,
        auth: false,
        status: 400,
        message: "Email is required!",
      });
    } else if (password === "") {
      res.json({
        error: true,
        auth: false,
        status: 400,
        message: "Password is required!",
      });
    } else if (Array.isArray(response) && response.length === 0) {
      res.json({
        error: true,
        auth: false,
        status: 400,
        message: "Email not found",
      });
    } else if (!bcrypt.compareSync(password, response[0].password)) {
      res.json({
        error: true,
        auth: false,
        status: 400,
        message: "Password is Invalid!",
      });
    } else if (response[0].status === 0) {
      res.json({
        error: true,
        auth: false,
        status: 400,
        message: "You are Inactive Contact Admin!",
      });
    } else if (
      bcrypt.compareSync(password, response[0].password) &&
      email === response[0].emailId
    ) {
      const accessToken = generateAccessToken();
      const refreshToken = generateRefreshToken();
      refreshTokens.push(refreshToken);
      res.json({
        error: false,
        status: 200,
        message: "Logged in SuccessFully",
        auth: true,
        accessToken: accessToken,
        // refreshToken: refreshToken,
        data: response[0],
      });
    } else {
      res.json({
        error: true,
        auth: false,
        status: 400,
        message: "Something went wrong!",
      });
    }
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({
      error:true,
      status: 500,
      message: "Internal server error",
      details: err.message, // Include the error details in the response
    });
  }
};

module.exports = { LoginAuth };
