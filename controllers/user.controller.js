import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplates from "../utils/verifyEmailTemplates.js";
import bcrypt from "bcryptjs";
import generateAccessToken from "../utils/genratedAccessToken.js";
import generateRefreshToken from "../utils/genratedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import genrateOTP from "../utils/genrateOTP.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTamplates.js";
import jwt from 'jsonwebtoken'

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
     user.last_login_date = new Date(); // 👈 update login date
    await user.save();

    // Send success response
    return res.status(200).json({
      message: "Logged in successfully.",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
       last_login_date: user.last_login_date, //  return karo response me

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


// Upload user avatar
export const avatarController = async (req, res) => {
  try {
    const userId = req.userId; // auth middleware
    const image = req.file;    // multer middleware

    if (!image) {
      return res.status(400).json({
        message: "No image file uploaded",
        success: false,
        error: true
      });
    }

    const upload = await uploadImageCloudinary(image);

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: upload.url },
      { new: true } // updated document return karne ke liye
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true
      });
    }

    return res.status(200).json({
      message: "Profile avatar uploaded successfully",
      success: true,
      error: false,
      data: {
        _id: userId,
        avatar: upload.url
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true
    });
  }
};

//updated user details

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { name, email, mobile, password } = req.body;

    let hashPassword = "";
    if (password) {
      // Hash password
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(mobile && { mobile }),
        ...(password && { password: hashPassword }),
      },
      { new: true } // return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "User details updated successfully",
      error: false,
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while updating profile details",
      error: true,
      success: false,
      details: error.message, // optional: send only message
    });
  }
};


//forgot password not login

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist.",
        error: true,
        success: false,
      });
    }

    // Generate OTP and expiry
    const otp = genrateOTP();
    const expireTime = Date.now() + 60 * 60 * 1000; // 1 hour from now

    await UserModel.findByIdAndUpdate(
      user._id,
      {
        forgot_password_otp: otp,
        forgot_password_expiry: new Date(expireTime), // direct Date object
      },
      { new: true }
    );

    // Send OTP email
    await sendEmail({
      sendTo: email,
      subject: "Password Reset OTP - Satyam Store",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return res.status(200).json({
      message: "Password reset OTP has been sent to your email. Please check your inbox.",
      error: false,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Internal server error in forgot password: ${error.message || error}`,
      error: true,
      success: false,
    });
  }
};


//verify forgot password otp

export const verifyForgotPasswordOtp = async(req,res)=>{
  try {
     const {email , otp} = req.body;
      // Check if user exists
      if(!email || !otp){
        return res.status(404).json({
        message: "Please provide your email and otp.",
        error: true,
        success: false,
      })
      }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist.",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date()
    
    if(user.forgot_password_expiry < currentTime){
      return res.status(404).json({
        message: "Your password with expired due to timelimit of 1 hours.",
        error: true,
        success: false,
      });
    }

    if(otp !== user.forgot_password_otp){
      return res.status(404).json({
        message: "Invalit OTP.",
        error: true,
        success: false,
      });
    }

    //if otp is not expired
    //if otp === user.forgot_password_otp)
       return res.status(201).json({
        message: "Otp verified",
        error: false,
        success: true,
      });
    
        
  } catch (error) {
     return res.status(500).json({
      message: `Internal server error in forgot password at verification: ${error.message || error}`,
      error: true,
      success: false,
    });
  }
} 

// reset the password
export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Basic validation
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Please provide email, newPassword, and confirmPassword",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "newPassword and confirmPassword must be the same",
        error: true,
        success: false,
      });
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    await UserModel.findByIdAndUpdate(user._id, { password: hashPassword });

    return res.status(200).json({
      message: "Password reset successfully",
      error: false,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Internal server error in reset password: ${error.message || error}`,
      error: true,
      success: false,
    });
  }
};

//refresh token controller

export const refreshTokenController = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;
    const tokenFromHeader = req.headers?.authorization?.split(" ")[1];
    const refreshToken = tokenFromCookie || tokenFromHeader;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing. Please login again.",
        error: true,
        success: false,
      });
    }

    // Verify token
    let verifyToken;
    try {
      verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    } catch (err) {
      return res.status(403).json({
        message: "Invalid or expired refresh token. Please login again.",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken._id;

    // Generate new access token
    const newAccessToken = await generateAccessToken(userId);

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true, // set false if testing on localhost without HTTPS
      sameSite: "None",
    };
    res.cookie("accessToken", newAccessToken, cookieOptions);

    return res.status(200).json({
      message: "Access token refreshed successfully.",
      error: false,
      success: true,
      data: { accessToken: newAccessToken },
    });

  } catch (error) {
    return res.status(500).json({
      message: `Internal server error in refresh token: ${error.message || error}`,
      error: true,
      success: false,
    });
  }
};
