const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String },
  email: { type: String, required: true, unique: true },
  first_name: { type: String },
  last_name: { type: String },
  created: { type: Date, default: Date.now },
  //password: String,
  isVerified: { type: Boolean, default: false },
  event_id: { type: String },
  //verificationToken: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
