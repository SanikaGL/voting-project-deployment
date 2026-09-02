const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Atlas connected successfully");

    // Create Schema
    const userSchema = new mongoose.Schema({
      name: String,
      age: Number,
    });

    // Create Model (Collection name will be 'users')
    const Use = mongoose.model("Use", userSchema);

    // Insert one document
    const newUser = new Use({
      name: "Sanika",
      age: 21,
    });

    await newUser.save();

    console.log("🎉 Database and Collection created successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();