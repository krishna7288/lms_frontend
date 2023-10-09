// routes/SuperadminLoginAuthRoutes.js
const express = require("express");
const router = express.Router();

const {
  LoginAuth
 
} = require("../controllers/LoginAuthController");

router.post("/login", LoginAuth);

module.exports = router;
