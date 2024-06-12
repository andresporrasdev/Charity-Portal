const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  first_name: { type: String },
  last_name: { type: String },
  created: { type: Date, default: Date.now },
  password: { type: String, required: true },
  // confirmPassword: {
  //   type: String,
  //   required: true,
  //   //This validator will only work for save and create
  //   validate: function (val) {
  //     return val == this.password;
  //   },
  //   message: "Password & Confirm Password does not match",
  // },
  isEmailVerified: { type: Boolean, default: true },
  isPaid: { type: Boolean, default: false },
  event_id: { type: String },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  //verificationToken: String,
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
