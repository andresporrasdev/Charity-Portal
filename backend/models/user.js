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
  isActive: { type: Boolean, default: true },
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

// Update 'isPaid' to false if one year has passed since 'created' date
userSchema.pre("save", function (next) {
  const currentDate = new Date();

  const createdDate = this.created;
  const oneYearLater = new Date(createdDate);
  oneYearLater.setFullYear(createdDate.getFullYear() + 1);

  // If the current date is greater than one year later, set 'isPaid' to false
  if (currentDate > oneYearLater) {
    this.isPaid = false;
    this.isActive = false;
  } else {
    this.isPaid = true; // Optional, as 'isPaid' defaults to true
    this.isActive = true;
  }
  next();
});

//return only documents where the isActive is not false for all find-related queries
userSchema.pre(/^find/, function (next) {
  // only apply isActive filter if `this._activeFilter` is not set to false
  if (!this._activeFilterDisabled) {
    this.find({ isActive: { $ne: false } });
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
