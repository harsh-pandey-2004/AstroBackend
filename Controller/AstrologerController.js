const Astrologer=require('../Model/AstroModel');
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// generating randome otp of 4 digit
const generateOTP = () => {
    // Generate a random 4-digit OTP
    return Math.floor(1000 + Math.random() * 9000);
};
const generateSlug = (name, mobile, index = 0) => {
    const namePart = name.toLowerCase().replace(/\s+/g, '-');
    const mobilePart = mobile.slice(0, 3);
    const uniquePart = index > 0 ? `-${index}` : ''; // Add unique index if necessary
    return `${namePart}-${mobilePart}${uniquePart}`;
  };

const generateUniqueSlug = async (name, mobile) => {
    let slug = generateSlug(name, mobile);
    let astrologer = await Astrologer.findOne({ slug });
    let index = 1;
  
    while (astrologer) {
      slug = generateSlug(name, mobile, index);
      astrologer = await Astrologer.findOne({ slug });
      index++;
    }
  
    return slug;
};

const AstrologerRegister = async (req, res) => {
    try {
      const validate = validationResult(req);
      if (!validate.isEmpty()) {
        return res.status(400).json({
          success: false,
          msg: "Errors",
          errors: validate.array(),
        });
      }
  
      const { name, mobile, password } = req.body;
      const slug = await generateUniqueSlug(name, mobile);
      // Check if mobile number already exists
      const isExist = await Astrologer.findOne({ mobile });
      if (isExist) {
        return res.status(400).json({
          success: false,
          msg: "Mobile number already exists",
        });
      }
      // Generate a random 4-digit OTP
      const otp = generateOTP();
  
      // Hash the password
      const hashPassword = await bcrypt.hash(password, 10);
  
      // Create a new user instance
      const newAstrolger = new Astrologer({
        name,
        mobile,
        password: hashPassword,
        otp: otp,
        slug
      });
  
      // Save the new user to the database
      const savedAstrologer = await newAstrolger.save();
  
      return res.status(200).json({
        success: true,
        msg: "Registered successfully",
        Astrologer: savedAstrologer,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }
};
const otpVerification = async (req, res) => {
    try {
      const { id: mobile } = req.params;
      const otp = req.body;
      const otp1 = otp.otp;
      if (!mobile) {
        return res.status(400).json({
          success: false,
          msg: "mobile is not getting from url",
        });
      }
      const AstrologerData = await Astrologer.findOne({ mobile });
      if (!AstrologerData) {
        return res.status(400).json({
          success: false,
          msg: "mobile or Password is incorrect",
        });
      }
      if (AstrologerData.otp == otp1) {
        // Update the otp field to null
        await Astrologer.updateOne({ mobile }, { $set: { otp: null } });
        // Updating the verified
        await Astrologer.updateOne({ mobile }, { $set: { is_verified: 1 } });
        return res.status(200).json({
          success: true,
          msg: "OTP verified successfully",
          user: AstrologerData,
        });
      } else {
        return res.status(401).json({
          success: false,
          msg: "OTP is incorrect",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }
};  
const AstrologerLogin = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: "false",
          msg: "Errors",
          errors: errors.array(),
        });
      }
      const { mobile, password } = req.body;
      const AstrologerData = await Astrologer.findOne({ mobile });
      if (!AstrologerData) {
        return res.status(400).json({
          success: false,
          msg: "mobile or Password is incorrect",
        });
      }
      const passwordmatch = await bcrypt.compare(password, AstrologerData.password);
      if (!passwordmatch) {
        return res.status(401).json({
          success: false,
          msg: "mobile and Password is incorrect",
        });
      }
      return res.status(200).json({
        success: true,
        msg: "Login Successfully",
        Astrologer: AstrologerData,
      });
    } catch (error) {
      return res.status(400).json({
        success: "False",
        msg: "error in login user",
        error: error.message,
      });
    }
};
const updateAstrologer = async (req, res) => {
    try {
      const slug = req.params; 
      const updates = req.body;
      if (req.file) {
        updates.image = req.file.filename;
      }
      const Astrologerr = await Astrologer.findOneAndUpdate({ slug: slug }, updates, {
        new: true,
    });
      if (!Astrologerr) {
        return res.status(404).json({ message: "Astrologer not found" });
      }
  
      res
        .status(200)
        .json({ message: "Astrologer details updated successfully", Astrologerr});
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};
const getAstrologer=async(req,res)=>{
    try {
        const AstroData= await Astrologer.find({});
        return res.status(200).json({
            Astrodata:AstroData
        })
    } catch (error) {
        return res.status(500).json({
            message:"Error in fetching data",error
        })
    }
}
const getAstrologerProfile=async(req,res)=>{
    try {
        const slug=req.params
        const AstroData= await Astrologer.findOne({slug})
        if(!AstroData){
            return res.status(200).json({
                message:"Astrologer not found"
            })
        }
        return res.status(200).json({
            message:"Success",
            Data:AstroData
        })
    } catch (error) {
        return res.status(400).json({
            message:error
        })
    }
}
module.exports = {
    AstrologerRegister,
    otpVerification,
    AstrologerLogin,
    updateAstrologer,
    getAstrologer,
    getAstrologerProfile
};