const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// generating randome otp of 4 digit
const generateOTP = () => {
  // Generate a random 4-digit OTP
  return Math.floor(1000 + Math.random() * 9000);
};

const generateSlug = (name, mobile, index = 0) => {
  const namePart = name.toLowerCase().replace(/\s+/g, "-");
  const mobilePart = mobile.slice(0, 3);
  const uniquePart = index > 0 ? `-${index}` : "";
  return `${namePart}-${mobilePart}${uniquePart}`;
};

const generateUniqueSlug = async (name, mobile) => {
  let slug = generateSlug(name, mobile);
  let existingUser = await User.findOne({ slug });
  let index = 1;

  while (existingUser) {
    slug = generateSlug(name, mobile, index);
    existingUser = await User.findOne({ slug });
    index++;
  }

  return slug;
};

// const userRegister = async (req, res) => {
//   try {
//     const validate = validationResult(req);
//     if (!validate.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         msg: "Errors",
//         errors: validate.array(),
//       });
//     }

//     const { name, mobile, password } = req.body;

//     // Check if mobile number already exists
//     const isExist = await User.findOne({ mobile });
//     if (isExist) {
//       return res.status(400).json({
//         success: false,
//         msg: "Mobile number already exists",
//       });
//     }
//     // Generate a random 4-digit OTP
//     // const otp = generateOTP(); 
//     const slug = await generateUniqueSlug(name, mobile);
//     console.log("Generated slug:", slug);

//     // Hash the password
//     const hashPassword = await bcrypt.hash(password, 10);

//     // Create a new user instance
//     const newUser = new User({
//       name,
//       mobile,
//       password: hashPassword,
//       // otp: otp,
//       slug,
//       created_date: new Date().toLocaleDateString("en-GB"), // Set the created_date field to the current date
//       created_by: name,
//       updated_date: null,
//       updated_by: null,
//     });

//     // Save the new user to the database
//     const savedUser = await newUser.save();

//     // return res.status(200).json({
//     //   success: true,
//     //   msg: "Registered successfully",
//     //   user: savedUser,
//     // });
//     next();
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       msg: error.message,
//     });
//   }
// };
// const sendOtp=async(req,res)=>{
//   try {
//     const {mobile}=req.body;
//     // Generate a random 4-digit OTP
//     const otp = generateOTP(); 
//     const cDate=new Date();
//     const isExist = await User.findOneAndUpdate(
//       { mobile },
//       {otp, otpExpiration: new Date(cDate.getTime())},
//       {upsert:true, new:true, setDefaultsOnInsert:true}
//     );
//     return res.status(200).json({
//         success: true,
//         msg: "Registered successfully and OTP sent",
//         user: savedUser,
//       });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       msg: error.message,
//     });
//   }
// }

const userRegister = async (req, res, next) => {
  try {
    const { name, mobile, password } = req.body;

    // Check if mobile number already exists
    let user = await User.findOne({ mobile });
    if (user) {
      // If user exists, attach the user to the request object and proceed to next middleware
      req.user = user;
      return next();
    }

    const slug = await generateUniqueSlug(name, mobile);
    console.log("Generated slug:", slug);

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      name,
      mobile,
      password: hashPassword,
      slug,
      created_date: new Date().toLocaleDateString("en-GB"),
      created_by: name,
      updated_date: null,
      updated_by: null,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Attach the saved user to the request object
    req.user = savedUser;

    // Proceed to the next middleware/controller
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const sendOtp = async (req, res) => {
  try {
    const user = req.user;
    const otp = generateOTP(); 
    const cDate = new Date();

    user.otp = otp;
    user.otpExpiration = new Date(cDate.getTime());
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      msg: "Registered successfully and OTP sent",
      user: updatedUser,
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
        msg: "slug is not getting from url",
      });
    }
    const userData = await User.findOne({ mobile });
    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "mobile or Password is incorrect",
      });
    }
    if (userData.otp == otp1) {
      // Update the otp field to null
      await User.updateOne({ mobile }, { $set: { otp: null } });
      // Updating the verified
      await User.updateOne({ mobile }, { $set: { is_verified: 1 } });
      return res.status(200).json({
        success: true,
        msg: "OTP verified successfully",
        user: userData,
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

const loginUser = async (req, res) => {
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
    const userData = await User.findOne({ mobile });
    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "mobile or Password is incorrect",
      });
    }
    const passwordmatch = await bcrypt.compare(password, userData.password);
    if (!passwordmatch) {
      return res.status(401).json({
        success: false,
        msg: "mobile and Password is incorrect",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "Login Successfully",
      user: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: "False",
      msg: "error in login user",
      error: error.message,
    });
  }
};

const getuserData = async (req, res) => {
  try {
    const {slug} = req.params.slug; 
    const existingUser = await User.findOne({ slug });
    if (!existingUser) {
      return res.status(401).send({
        success: false,
        message: "user id is not there in user model data",
      });
    }
    return res.status(201).send({
      status: true,
      existingUser,
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Error in user details",
      error,
    });
  }
};

module.exports = {
  userRegister,
  loginUser,
  otpVerification,
  getuserData,
  sendOtp
};
