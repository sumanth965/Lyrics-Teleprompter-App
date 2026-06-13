const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

const emailRegex = /^\S+@\S+\.\S+$/;

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured");
    error.statusCode = 500;
    throw error;
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const sendAuthResponse = (res, statusCode, user) => {
  res.status(statusCode).json({
    token: signToken(user._id),
    user: safeUser(user),
  });
};

const validateAuthInput = ({ name, email, password }, isRegister = false) => {
  if (isRegister && !name?.trim()) return "Name is required";
  if (!email?.trim() || !emailRegex.test(email)) return "A valid email is required";
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
};

const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const validationError = validateAuthInput({ name, email, password }, true);
  if (validationError) return res.status(400).json({ message: validationError });

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) return res.status(409).json({ message: "Email is already registered" });

  const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
  sendAuthResponse(res, 201, user);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const validationError = validateAuthInput({ email, password });
  if (validationError) return res.status(400).json({ message: validationError });

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  sendAuthResponse(res, 200, user);
});

const getMe = catchAsync(async (req, res) => {
  res.json({ user: safeUser(req.user) });
});

module.exports = { register, login, getMe };
