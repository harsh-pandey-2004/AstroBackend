const AstroloCouncellor = require("../Model/AstroCouncellor");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// Generating a random 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

const generateSlug = (name, mobile, index = 0) => {
  const namePart = name.toLowerCase().replace(/\s+/g, "-");
  const mobilePart = mobile.slice(0, 3);
  const uniquePart = index > 0 ? `-${index}` : "";
  return `${namePart}-${mobilePart}${uniquePart}`;
};

const generateUniqueSlug = async (name, mobile) => {
  let slug = generateSlug(name, mobile);
  let existingCouncellor = await AstroloCouncellor.findOne({ slug });
  let index = 1;

  while (existingCouncellor) {
    slug = generateSlug(name, mobile, index);
    existingCouncellor = await AstroloCouncellor.findOne({ slug });
    index++;
  }

  return slug;
};

const AstroCouncellorRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { name, mobile, password } = req.body;
    console.log("Received data:", name, mobile, password);

    const slug = await generateUniqueSlug(name, mobile);
    console.log("Generated slug:", slug);

    // Check if mobile number already exists
    const isExist = await AstroloCouncellor.findOne({ mobile });
    console.log("Mobile exists:", isExist);

    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "Mobile number already exists",
      });
    }

    const otp = generateOTP();
    const hashPassword = await bcrypt.hash(password, 10);

    const newAstroCouncellor = new AstroloCouncellor({
      name,
      mobile,
      password: hashPassword,
      otp,
      slug,
    });
    console.log("New AstroCouncellor object:", newAstroCouncellor);

    const savedAstroCouncellor = await newAstroCouncellor.save();
    console.log("Saved AstroCouncellor:", savedAstroCouncellor);

    return res.status(200).json({
      success: true,
      msg: "Registered successfully",
      Astrologer: savedAstroCouncellor,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const otpVerification = async (req, res) => {
  try {
    const { id: mobile } = req.params;
    const { otp: otp1 } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        msg: "Mobile number is not provided",
      });
    }

    const AstrologerData = await AstroloCouncellor.findOne({ mobile });
    if (!AstrologerData) {  
      return res.status(400).json({
        success: false,
        msg: "Mobile or OTP is incorrect",
      });
    }

    if (AstrologerData.otp == otp1) {
      await AstroloCouncellor.updateOne({ mobile }, { $set: { otp: null, is_verified: 1 } });
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
    console.error("Error during OTP verification:", error);
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const AstroCouncellorLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { mobile, password } = req.body;
    const AstrologerData = await AstroloCouncellor.findOne({ mobile });
    if (!AstrologerData) {
      return res.status(400).json({
        success: false,
        msg: "Mobile or Password is incorrect",
      });
    }

    const passwordMatch = await bcrypt.compare(password, AstrologerData.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        msg: "Mobile and Password are incorrect",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Login Successfully",
      Astrologer: AstrologerData,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(400).json({
      success: false,
      msg: "Error in login user",
      error: error.message,
    });
  }
};

const updateAstroCouncellor = async (req, res) => {
  try {
    const {slug} = req.params.slug;
    const updates = req.body;
    if (req.file) {
      updates.image = `/astrocounselor-pics/${req.file.filename}`;
    }
    const updatedAstrologer = await AstroloCouncellor.findOneAndUpdate(slug, updates, { new: true });

    if (!updatedAstrologer) {
      return res.status(404).json({ message: "Astrologer not found" });
    }

    return res.status(200).json({ message: "Astrologer details updated successfully", Astrologer: updatedAstrologer });
  } catch (error) {
    console.error("Error updating Astrologer:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAstroCouncellor = async (req, res) => {
  try {
    const AstroData = await AstroloCouncellor.find({});
    return res.status(200).json({ Astrodata: AstroData });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Error in fetching data", error });
  }
};

const getAstroCouncellorProfile = async (req, res) => {
  try {
    const {slug} = req.params; 
    const AstroData = await AstroloCouncellor.findOne({ slug });

    if (!AstroData) {
      return res.status(200).json({ message: "Astrologer not found" });
    }

    return res.status(200).json({ message: "Success", Data: AstroData });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  AstroCouncellorRegister,
  otpVerification,
  AstroCouncellorLogin,
  updateAstroCouncellor,
  getAstroCouncellor,
  getAstroCouncellorProfile,
};
