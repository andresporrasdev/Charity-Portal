const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt'); // for hashing password
const saltRounds = 10; // number of salt rounds

const User = require("../models/user");
const Role = require("../models/role");

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

const saveExistingMemberToDB = async ({ email, password, first_name, last_name, created, event_id }) => {
  try {
    const role = await Role.findOne({ name: "Member" });

    if (!role) {
      throw new Error("Role not found");
    }

    const encryptedPassword = await encryptPassword(password);


    const user = new User({
      email,
      password: encryptedPassword, //encrypted password is added to the user object
      first_name,
      last_name,
      created,
      isEmailVerified: false,
      isPaid: true,
      event_id,
      roles: [role._id], // _id is Pk
    });
    await user.save();
    console.log("user data saved in saveUserToDB method");
    //console.log(user);
  } catch (error) {
    console.error("Error saving user to DB:", error);
    throw error;
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, //this gmail is created for testing purpose
    pass: process.env.MAIL_PASS,
  },
});

const generateNumericOTP = (length) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

const sendOTPByEmail = async (email) => {
  const otp = generateNumericOTP(6);

  const mailOptions = {
    from: "ottawa Sangam Tamil ",
    to: email,
    subject: "Verify your email address to register OTS",
    //text: `Your OTP for registration is: ${otp}`,
    html: `
      <div>
        <img src="cid:logo" style="display:block; margin:auto; width:100px; height:auto;" />
        <p>To verify your email address, please use the following One Time Password:</p>
        <h1 style="text-align:center;">${otp}</h1>
        <p>Do not share this OTP with anyone.</p>
        <p>Thank you!</p>
      </div>
    `,
    attachments: [
      {
        filename: "logo.jpg",
        path: "../frontend/src/image/logo.jpg",
        cid: "logo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to", email);
    return otp;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

exports.checkUser = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    //console.log(existingUser);

    // if the user already signed up
    if (existingUser) {
      if (!existingUser.isVerified) {
        const otp = await sendOTPByEmail(email);
        return res.status(200).json({
          status: "success",
          message: "User already exists in the database but email is not verified yet",
          data: existingUser,
          otp: otp,
          redirectUrl: "/otp",
        });
      } else {
        return res.status(200).json({
          status: "success",
          message: "User already exists and is verified",
          data: existingUser,
          redirectUrl: "/login",
        });
      }
    }

    const userData = await getUserDataFromMockFile(email);
    const otp = await sendOTPByEmail(email);

    //if user has a membership, but didn't sign up yet
    if (userData) {
      await saveExistingMemberToDB(userData);
      return res.status(200).json({
        status: "success",
        message: "User data fetched from mock data/EventBrite and saved to the database",
        data: userData,
        otp: otp,
        redirectUrl: "/", // URL for redirection
        //openModal: true,
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "User not found in mock data/EventBrite, please sign up as new user",
        otp: otp,
        redirectUrl: "/otp",
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
