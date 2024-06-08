const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  first_name: String,
  last_name: String,
  created: String,
  //password: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
