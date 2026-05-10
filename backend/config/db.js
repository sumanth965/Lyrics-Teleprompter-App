const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    
    // Mask URI for security but show some part
    const maskedUri = uri.replace(/\/\/.*@/, "//***:***@");
    console.log(`Connecting to MongoDB: ${maskedUri}`);

    await mongoose.connect(uri);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    // In production, we might want to keep the process alive if we have a retry strategy,
    // but for now, exiting is the standard behavior for fatal DB failure.
    process.exit(1);
  }
};

module.exports = connectDB;

