const User = require("../models/user");

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

const getUserDataFromMockFile = async (email) => {
  try {
    //const tempUserData = fs.readFileSync('tempUserData.json', 'utf8');
    // const orders = JSON.parse(tempUserData).orders;
    const tempUserData = require("./tempUserData");
    const foundUser = tempUserData.orders.find((order) => order.email === email);

    if (foundUser) {
      return foundUser;
    } else {
      console.log("cannot found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data from the mock file:", error);
    throw error;
  }
};

const saveUserToDB = async ({ email, first_name, last_name, created }) => {
  try {
    // const user = new User(userData);
    const user = new User({
      email,
      first_name,
      last_name,
      created,
      isVerified: false,
    });
    await user.save();
  } catch (error) {
    console.error("Error saving user to DB:", error);
    throw error;
  }
};

exports.checkUser = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(200).json({
        status: "success",
        message: "User already exists in the database",
        data: existingUser,
      });
    }

    const userData = await getUserDataFromMockFile(email);

    if (userData) {
      console.log(userData);
      await saveUserToDB(userData);
      return res.status(200).json({
        status: "success",
        message: "User data fetched from EventBrite and saved to the database",
        data: userData,
        redirectUrl: "/event", // URL for redirection
        //openModal: true,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "User not found in mock data",
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
