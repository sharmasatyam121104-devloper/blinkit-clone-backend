import jwt from "jsonwebtoken";

// Function to generate access token
const generateAccessToken = async(userId) => {
  try {
    const token = await jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_ACCESS_TOKEN,
      { expiresIn: "5h" } // 5 hours
    );

    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw new Error("Could not generate access token");
  }
};

export default generateAccessToken;
