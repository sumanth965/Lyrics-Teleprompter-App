const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Authentication token is required" });
  if (!process.env.JWT_SECRET) return res.status(500).json({ message: "JWT_SECRET is not configured" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const message = error.name === "TokenExpiredError" ? "Authentication token has expired" : "Invalid authentication token";
    return res.status(401).json({ message });
  }

  const user = await User.findById(decoded.id);
  if (!user) return res.status(401).json({ message: "User for this token no longer exists" });

  req.user = user;
  next();
});

module.exports = { protect };
