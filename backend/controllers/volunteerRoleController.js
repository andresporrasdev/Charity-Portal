const VolunteerRole = require("../models/volunteerRole");

exports.getAllVolunteerRole = async (req, res) => {
  try {
    const roles = await VolunteerRole.find();

    res.status(200).json({
      status: "success",
      data: { roles: roles },
    });

    console.log("roles:", roles);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch roles.",
    });
  }
};
