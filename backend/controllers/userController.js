const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcrypt"); // for hashing password
const saltRounds = 10; // number of salt rounds

// const getUserDataFromEventBrite = async (eventId, email) => {
//   try {
//     const response = await axios.get(`https://www.eventbriteapi.com/v3/events/${eventId}/orders?only_emails=${email}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.EVENTBRITE_API_KEY}`,
//       },
//     });
//     const users = response.data.users;
//     if (users && users.length > 0) {
//       return users[0];
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching data from EventBrite API:", error);
//     return null;
//   }
// };

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

const getUserDataFromMockFile = async (email) => {
  try {
    //const tempUserData = fs.readFileSync('tempUserData.json', 'utf8');
    // const orders = JSON.parse(tempUserData).orders;
    const tempUserData = require("../data/tempUserData.json");
    const foundUser = tempUserData.orders.find((order) => order.email === email);

    if (foundUser) {
      return foundUser;
    } else {
      console.log("This email is not exist in mock file.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data from the mock file:", error);
    throw error;
  }
};

//Previous code of saveExistingMemberToDB method
//const saveExistingMemberToDB = async ({ email, password, first_name, last_name, created, event_id }) => {

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

exports.signup = async (req, res) => {
  const { email, first_name, last_name, created, event_id, password } = req.body;
  try {
    await saveExistingMemberToDB({ email, first_name, last_name, created, event_id, password });

    const userData = { email, first_name, last_name, created, event_id };
    return res.status(200).json({
      status: "success",
      message: "Member saved successfully.",
      data: userData,
      redirectUrl: "/login",
    });
  } catch (error) {
    console.error("Error saving member:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.checkMembershipUser = async (req, res) => {
  const { email } = req.body;
  try {
    const userData = await getUserDataFromMockFile(email);
    console.log("userData:", userData);

    if (userData) {
      return res.status(200).json({
        status: "success",
        message: "User data fetched from mock data/EventBrite and saved to the database",
        data: userData,
      });
    } else {
      return res.status(200).json({
        status: "fail",
        message: "User not found in mock data/EventBrite, please sign up as new user",
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
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

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      redirectUrl: "/",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
