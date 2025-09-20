import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplates from "../utils/verifyEmailTemplates.js";
import bcrypt from "bcryptjs";
import generateAccessToken from "../utils/genratedAccessToken.js";
import generateRefreshToken from "../utils/genratedRefreshToken.js";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password.",
        error: true,
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered. Please login.",
        error: true,
        success: false,
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Create user payload
    const payload = {
      name,
      email,
      password: hashPassword,
    };

    // Save new user
    const newUser = new UserModel(payload);
    const savedUser = await newUser.save();

    // Generate email verification URL
    const verifyEmailUrl = await `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;
    
    // Send verification email
    await sendEmail({
      sendTo: email,
      subject: "Verify your email - Satyam Store",
      html: verifyEmailTemplates({name, url:verifyEmailUrl}),
    });  

    // Success response
    return res.status(201).json({
      message: "User registered successfully. Please check your email to verify your account.",
      error: false,
      success: true,
      data: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred during registration. Please try again later.",
      error: true,
      success: false,
      details: error.message,
    });
  }
};



export const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;

    //  Validate input
    if (!code) {
      return res.status(400).json({
        message: "Verification code is required.",
        error: true,
        success: false,
      });
    }

    //  Find user by ID
    const user = await UserModel.findById(code);
    if (!user) {
      return res.status(404).json({
        message: "User not found or invalid verification code.",
        error: true,
        success: false,
      });
    }

    //  Check if already verified
    if (user.verify_email) {
      return res.status(400).json({
        message: "Email is already verified.",
        error: true,
        success: false,
      });
    }

    // Update user verification status
    await UserModel.updateOne({ _id: code }, { verify_email: true });

    //  Success response
    return res.status(200).json({
      message: "User email verified successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error. " + (error.message || error),
      error: true,
      success: false,
    });
  }
};


//login controller

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
   if(!email || !password){
    return res.status(400).json({
        message: "Please enter a  Email ID or Password.",
        error: true,
        success: false,
      });       
   }
    //  Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Please enter a valid Email ID.",
        error: true,
        success: false,
      });
    }

    // Check if user is active or blocked
    if (!user.status === "Active") {
      return res.status(403).json({
        message: "Please contact admin. Your account is blocked.",
        error: true,
        success: false,
      });
    }

    //  Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Incorrect password.",
        error: true,
        success: false,
      });
    }

    // Generate tokens
    const accessToken = await generateAccessToken(user._id);
    
    const refreshToken = await generateRefreshToken(user._id);

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true, // set false if testing on localhost without HTTPS
      sameSite: "None",
    };
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Send success response
    return res.status(200).json({
      message: "Logged in successfully.",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


//logout controller

export const logoutController = async (req, res) => {
  try {
    const userId = req.userId; // middleware se aata hai

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true only in prod
      sameSite: "None",
    };

    // Clear cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    // Remove refresh token from DB
    await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });

    return res.status(200).json({
      success: true,
      error: false,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal server error",
    });
  }
};
