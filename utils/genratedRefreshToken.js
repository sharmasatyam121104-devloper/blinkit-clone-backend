import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

// Function to generate refresh token
const generateRefreshToken = async (userId) => {
  try {
    // Generate JWT refresh token
    const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // Save refresh token in user document
    await UserModel.updateOne({ _id: userId }, { refresh_token: token });

    // Return the token
    return token;
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new Error("Could not generate refresh token");
  }
};

export default generateRefreshToken;
