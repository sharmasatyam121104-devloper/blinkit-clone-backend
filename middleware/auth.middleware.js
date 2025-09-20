import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // Get token from cookies or header
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Access token is required",
      });
    }

    // Verify token
    const decoded =await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized access",
      });
    }

    // Attach userId to request
    req.userId = decoded.id;
    console.log("Decoded token:", decoded);

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal server error",
    });
  }
};

export default auth;
