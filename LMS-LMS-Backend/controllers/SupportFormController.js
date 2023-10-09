const supports = require("../models/SupportForm");

const getSupportForm = async (req, res) => {
    try {
      const data = await supports.find();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Support found",
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
  const createSupportForm = async (req, res) => {
    try {
      const file = req.files;

      console.log(req.body)
  
      console.log(file[0].filename);
  
      const supportFormData = {
       emailId: req.body.emailId,
       pointOfContact: req.body.pointOfContact,
       mobileNumber: req.body.mobileNumber,
       supportType: req.body.supportType,
       priority: req.body.priority,
       subject: req.body.subject,
       description: req.body.description,
       uploadFile: file[0].fileName,
      };
  
      console.log(supportFormData);

    
      const data = new supports(supportFormData);
      await data.save();
      res.status(200).json({
        error: false,
        status: 200,
        message: "Support created successfully",
        data: data,
      });
    
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
  module.exports = {
    getSupportForm,
    createSupportForm,
  };
  