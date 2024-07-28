const User = require("../models/user");
const Role = require("../models/role");
const { encryptPassword } = require("../utils/encryption");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

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

exports.updateUserStatuses = async () => {
  try {
    const currentDate = new Date();

    // find user who signed up more than a year ago and set their status to inactive
    const users = await User.find({
      created: { $lte: new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate()) },
    });

    for (const user of users) {
      user.isPaid = false;
      user.isActive = false;
      await user.save();
    }

    console.log("User statuses updated successfully.");
  } catch (error) {
    console.error("Error updating user statuses:", error);
  }
};

exports.saveAllUsersToDBFromMockFile = async () => {
  try {
    const filePath = path.join(__dirname, "../data/tempUserData.json");
    const tempUserData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const users = tempUserData.orders;
    const role = await Role.findOne({ name: "Member" });

    if (users.length > 0) {
      for (const user of users) {
        const query = User.findOne({ email: user.email });
        query._activeFilterDisabled = true;
        const existingUser = await query.exec();

        if (!existingUser) {
          // if user paid membership but not signed up before
          const newUser = new User({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            created: user.created,
            event_id: user.event_id,
            roles: [role._id],
            isPaid: true,
            isActive: false,
          });
          await newUser.save();
          console.log(`User with email ${user.email} has been saved.`);
        } else if (existingUser) {
          // if user exists in db then update
          if (!existingUser.isActive && !existingUser.isPaid) {
            existingUser.created = user.created;
            existingUser.event_id = user.event_id;
            existingUser.isPaid = true;
            await existingUser.save();
            if (existingUser.password) {
              // if the user has been singed up before and has a password
              existingUser.isActive = true;
              await existingUser.save();
            }
            console.log(`User with email ${user.email} has been updated.`);
          }
        }
      }
    } else {
      console.log("No users found in mock file.");
    }
  } catch (error) {
    console.error("Error saving users to DB:", error);
    throw error;
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
    const query = User.find().populate("roles", "name");
    // Create the query and set the custom flag to disable the isActive filter
    query._activeFilterDisabled = true;

    // Execute the query and convert Mongoose documents to plain JavaScript objects
    const users = await query.lean();

    //const users = await User.find().populate("roles", "name");

    const usersWithRoleNames = users.map((user) => ({
      ...user,
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

exports.updateUser = async (req, res) => {
  // check if request data contain password
  if (req.body.password) {
    res.status(400).json({
      status: "fail",
      message: "You can't update password using this endpoint.",
    });
  }
  //update user detail
  try {
    const filterObj = (obj, ...allowedFields) => {
      const newObj = {};
      Object.keys(obj).forEach((key) => {
        if (allowedFields.includes(key)) {
          newObj[key] = obj[key];
        }
      });
      return newObj;
    };

    const filteredBody = filterObj(req.body, "roles");

    //Convert Roles to ObjectIds
    if (filteredBody.roles && Array.isArray(filteredBody.roles)) {
      filteredBody.roles = filteredBody.roles.map((role) => {
        if (mongoose.Types.ObjectId.isValid(role)) {
          return mongoose.Types.ObjectId(role);
        } else {
          throw new Error(`Invalid ObjectId: ${role}`);
        }
      });
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, filteredBody, { runValidators: true, new: true });

    if (!updateUser) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with that ID.",
      });
    }

    if (!updateUser.roles || updateUser.roles.length === 0) {
      return res.status(400).json({
        status: "role-fail",
        message: "User must have at least one role.",
      });
    }

    res.status(200).json({
      status: "Success",
      data: {
        user: updateUser,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update user.",
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false, $unset: { password: "" } });
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
