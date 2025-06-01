const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;

const connectTheDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.log("An error occurred", err);
    throw err;
  }
};

module.exports = connectTheDB;
