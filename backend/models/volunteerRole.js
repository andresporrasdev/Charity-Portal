const mongoose = require("mongoose");

const VolunteerRoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

const VolunteerRole = mongoose.model("VolunteerRole", VolunteerRoleSchema);

module.exports = VolunteerRole;
