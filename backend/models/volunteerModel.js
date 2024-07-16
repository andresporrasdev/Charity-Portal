const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: false,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10}$/,
    },
    preferredRoles: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VolunteerRole",
      required: true,
      trim: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      required: true,
      trim: true,
    },
    parentName: {
      type: String,
      required: false,
      trim: true,
    },
    agreePolicies: {
      type: Boolean,
      required: true,
    },
    understandUnpaid: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;
