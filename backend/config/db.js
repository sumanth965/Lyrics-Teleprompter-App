const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    
    // Extract hostname for DNS debugging
    const hostname = uri.split("@")[1]?.split("/")[0];
    console.log(`Attempting to resolve hostname: ${hostname}`);

    // Mask URI for security but show some part
    const maskedUri = uri.replace(/\/\/.*@/, "//***:***@");
    console.log(`Connecting to MongoDB: ${maskedUri}`);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    // Removed process.exit(1) to allow the app to stay alive and return 503 via middleware
    // This helps in production debugging and prevents restart loops.
  }
};


module.exports = connectDB;

