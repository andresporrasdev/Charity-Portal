const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
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
	unique: true,
	match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  contactNumber: {
	type: String,
	required: true,
	trim: true,
	match: /^[0-9]{10}$/,
  },
  preferredRoles: {
	type: String,
	required: true,
	trim: true,
  },
  event: {
	type: String,
	required: true,
	trim: true,
  },
  parentName: {
	type: String,
	required: true,
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
}, { timestamps: true });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;