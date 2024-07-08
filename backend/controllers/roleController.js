const Role = require("../models/role");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();

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
