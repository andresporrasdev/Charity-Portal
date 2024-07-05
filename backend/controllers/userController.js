const User = require("../models/user");
const Role = require("../models/role");
const { encryptPassword } = require("../utils/encryption");

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

exports.saveMemberToDB = async (userData) => {
  try {
    const role = await Role.findOne({ name: "Member" });

    if (!role) {
      throw new Error("Role not found");
    }
    const encryptedPassword = await encryptPassword(userData.password);

    const user = new User({
      ...userData,
      password: encryptedPassword,
      roles: [role._id], // _id is Pk
    });
    await user.save();
    console.log("user data saved in saveUserToDB method");
  } catch (error) {
    console.error("Error saving user to DB:", error);
    throw error;
  }
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) newObj[prop] = obj[prop];
  });
  return newObj;
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

exports.getUserInfo = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
    console.log("user:", req.user);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user info.",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    //Populate the roles field to fetch role names
    const users = await User.find().populate("roles", "name");

    const usersWithRoleNames = users.map((user) => ({
      ...user.toObject(),
      roles: user.roles.map((role) => role.name),
    }));

    res.status(200).json({
      status: "success",
      results: usersWithRoleNames.length,
      data: { users: usersWithRoleNames },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users.",
    });
  }
};

exports.updateUser = async (req, res, next) => {
  // check if request data contain password
  if (req.body.password) {
    res.status(400).json({
      status: "fail",
      message: "You can't update password using this endpoint.",
    });
  }
  //update user detail
  try {
    const filterObj = filterObj(req.body, "first_name", "last_name", "roles"); // set only fields allowed to update
    const updateUser = await User.findByIdAndUpdate(req.user.id, filterObj, { runValidators: true, new: true });
    //const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, { new: true, runValidators: true });
    res.status(200).json({
      status: "Success",
      data: {
        user: updateUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update user.",
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete user.",
    });
  }
};
