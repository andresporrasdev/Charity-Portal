const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcrypt"); // for hashing password
const saltRounds = 10; // number of salt rounds
const jwt = require("jsonwebtoken");

const signToken = (email) => {
  return jwt.sign({ email }, process.env.SECRET_STR, {
    // payload, screte string
    expiresIn: process.env.LOGIN_EXPIRE,
  });
};
const saveExistingMemberToDB = async ({ email, first_name, last_name, created, event_id, isPaid, password }) => {
  try {
    const role = await Role.findOne({ name: "Member" });

    if (!role) {
      throw new Error("Role not found");
    }

    const encryptedPassword = await encryptPassword(password);

    const user = new User({
      email,
      first_name,
      last_name,
      created,
      password,
      isEmailVerified: true,
      isPaid,
      password: encryptedPassword, //encrypted password is added to the user object
      event_id,
      roles: [role._id], // _id is Pk
    });
    await user.save();
    console.log("user data saved in saveUserToDB method");
  } catch (error) {
    console.error("Error saving user to DB:", error);
    throw error;
  }
};

// this method is used to encrypt the password
const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error encrypting password:", error);
    return null;
  }
};

exports.signup = async (req, res) => {
  const { email, first_name, last_name, created, event_id, password } = req.body;
  try {
    await saveExistingMemberToDB({ email, first_name, last_name, created, event_id, password });

    const userData = { email, first_name, last_name, created, event_id };

    const token = signToken(email);

    console.log("token from signup: ", token);
    return res.status(200).json({
      status: "success",
      message: "Member saved successfully.",
      token,
      data: userData,
      redirectUrl: "/login",
    });
  } catch (error) {
    console.error("Error saving member:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // If email or password is missing
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password." });
  }

  try {
    const existingUser = await User.findOne({ email });
    console.log("User found:", existingUser);

    if (!existingUser) {
      return res.status(200).json({
        status: "fail",
        message: "user doesn't exist. Please sign up.",
        redirectUrl: "/",
      });
    }

    const passwordMatch = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      return res.status(200).json({
        status: "fail",
        message: "Password doesn't match. Please try again.",
        redirectUrl: "/",
      });
    }

    const token = signToken(email);

    console.log("token from login: ", token);
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      redirectUrl: "/",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
