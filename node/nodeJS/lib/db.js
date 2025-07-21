const mongoose = require('mongoose');

//connect to database
const connectToDb = async () => {
  try {
    await mongoose.connect("mongodb+srv://decodingade:decodingade2025@cluster0.bps42zc.mongodb.net/node-nest").then(() => {
      console.log("Connected to MongoDB database");
    })
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1)
  }
}

module.exports = connectToDb