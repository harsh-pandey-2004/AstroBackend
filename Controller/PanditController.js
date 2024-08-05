const bcrypt = require("bcrypt");
const Pandit = require("../Model/panditModel");
const BookingPandit = require("../Model/BookPanditModel");
const { validationResult } = require("express-validator");



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
  let existingPandit = await Pandit.findOne({ slug });
  let index = 1;

  while (existingPandit) {
    slug = generateSlug(name, mobile, index);
    existingPandit = await Pandit.findOne({ slug });
    index++;
  }

  return slug;
};

const otpVerificationPandit = async (req, res) => {
  try {
    const { id: mobile } = req.params;
    const { otp } = req.body;
    const otp1 = otp;
    if (!mobile) {
      return res.status(400).json({
        success: false,
        msg: "mobile is not getting from url",
      });
    }
    const userData = await Pandit.findOne({ mobile });
    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "mobile or Password is incorrect",
      });
    }
    if (userData.otp == otp1) {
      // Update the otp field to null
      await Pandit.updateOne({ mobile }, { $set: { otp: null } });
      // Updating the verified
      await Pandit.updateOne({ mobile }, { $set: { is_verified: 1 } });
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
const panditRegister = async (req, res) => {
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

    // Check if mobile number already exists
    const isExist = await Pandit.findOne({ mobile });
    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "Mobile number already exists",
      });
    }
    // Generate a random 4-digit OTP
    const otp = generateOTP();

    const slug = await generateUniqueSlug(name, mobile);
    console.log("Generated slug:", slug);

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newPandit = new Pandit({
      name,
      mobile,
      password: hashPassword,
      otp: otp,
      slug
    });

    // Save the new user to the database
    const savedPandit = await newPandit.save();

    return res.status(200).json({
      success: true,
      msg: "Registered successfully",
      user: savedPandit,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};
const loginpandit = async (req, res) => {
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
    console.log(mobile, password);
    const panditData = await Pandit.findOne({ mobile });
    if (!panditData) {
      return res.status(400).json({
        success: false,
        msg: "mobile or Password is incorrect",
      });
    }
    const passwordmatch = await bcrypt.compare(password, panditData.password);
    if (!passwordmatch) {
      return res.status(401).json({
        success: false,
        msg: "mobile and Password is incorrect",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "Login Successfully",
      user: panditData,
    });
  } catch (error) {
    return res.status(400).json({
      success: "False",
      msg: "error in login user",
      error: error.message,
    });
  }
};
const updatePandit = async (req, res) => {
  try {
  
    const slug = req.params;
    const data  = req;
    console.log(slug)
    console.log(data.body)
    // if (req.file) {
    //   data.image = req.file.filename;
    // }
    const pandit = await Pandit.findOneAndUpdate(
      slug,data.body,
      { new: true }
    );
    console.log("updated",pandit)
    // if (!pandit) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    res
      .status(200)
      .json({ message: "Pandit details updated successfully", pandit });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const BookPanditwithPooja = async (req, res) => {
  const UserId = req.params.id;

  try {
    const {
      poojaName,
      panditName,
      Day,
      Time,
      PanditId,
      MaterialRequired,
      TotalPrice,
    } = req.body;

    // Validate required fields
    if (
      !poojaName ||
      !panditName ||
      !Day ||
      !Time ||
      !PanditId ||
      !TotalPrice
    ) {
      return res.status(400).json({
        success: false,
        msg: "Missing required fields",
      });
    }

    // Check if booking already exists
    const isExistPooja = await BookingPandit.findOne({
      Day,
      Time,
      userId: UserId,
      PanditId,
    });
    if (isExistPooja) {
      return res.status(400).json({
        success: false,
        msg: "Booking already exists",
      });
    }

    // Create a new booking
    const bookingData = new BookingPandit({
      poojaName,
      panditName,
      Day,
      Time,
      PanditId,
      MaterialRequired,
      TotalPrice,
      userId: UserId,
    });

    const savedBooking = await bookingData.save();

    // Update the Pandit document
    const updatedPandit = await Pandit.findByIdAndUpdate(
      PanditId,
      {
        $push: {
          bookings: {
            bookingId: savedBooking._id,
            date: Day,
            time: Time,
          },
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!updatedPandit) {
      return res.status(404).json({ message: "Pandit not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      UserId,
      {
        $push: {
          bookings: {
            bookingId: savedBooking._id,
            date: Day,
            time: Time,
          },
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({
      message: "Booking created and Pandit and User updated successfully",
      booking: savedBooking,
      pandit: updatedPandit,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking", error });
  }
};

const getPanditById = async (req, res) => {
  try {
    const {slug} = req.params;
    // console.log(id);

    const pandit = await Pandit.findOne({slug});

    if (!pandit) {
      return res.status(404).json({
        success: false,
        msg: "Pandit not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Pandit found",
      panditData: pandit,
    });
  } catch (error) {
    console.error("Error fetching pandit data:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};

const getpanditBypooja = async (req, res) => {
  try {
    const data = req.body;
    const response = await Pandit.find();
    return res.status(200).json({
      success: true,
      msg: "data Found",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching panditPooja data:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  loginpandit,
  panditRegister,
  otpVerificationPandit,
  getpanditBypooja,
  BookPanditwithPooja,
  getPanditById,
  updatePandit,
};
