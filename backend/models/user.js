const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  first_name: { type: String },
  last_name: { type: String },
  created: { type: Date, default: Date.now },
  password: { type: String, required: true },
  isPaid: { type: Boolean, default: true },
  event_id: { type: String },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  passwordChangedAt: Date,
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const pwdChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(pwdChangedTimestamp, JWTTimestamp);

    return JWTTimestamp < pwdChangedTimestamp;
  }
  return false; //password not changed
};

userSchema.methods.createResetPasswordToken = function () {
  //only user can access to this reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // to encrypt this token
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000; // expires in 10mins

  console.log("resetToken:", resetToken, this.passwordResetTokenExpire);
  return resetToken; // user get reset token but it will be savea as encrypted in db
};

const User = mongoose.model("User", userSchema);

module.exports = User;
