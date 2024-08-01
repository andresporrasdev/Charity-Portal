const Otp = require("../models/otp");
const User = require("../models/user");
const { sendEmail } = require("./../utils/email");

const generateNumericOTP = (length) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

const sendOTPByEmail = async (email, otp) => {
  console.log("Sending OTP to:", email);
  const mailOptions = {
    email: email,
    subject: "Verify your email address to register OTS",
    html: `
      <div>
        <img src="cid:logo" style="display:block; margin:auto; width:100px; height:auto;" />
        <p>To verify your email address, please use the following One Time Password:</p>
        <h1 style="text-align:center;">${otp}</h1>
        <p>This OTP code will be expried in 5mins.</p>
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
    await sendEmail(mailOptions);
    return otp;
  } catch (error) {
    console.error("Error sending OTP by email:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
};

exports.sendOtp = async (req, res) => {
  const { email, source } = req.body;
  try {
    //const existingUser = await User.findOne({ email });
    let existingUser;

    const sendOtpAndRespond = async () => {
      const otp = generateNumericOTP(6);
      await Otp.create({ email, otp });
      await sendOTPByEmail(email, otp);

      return res.status(200).json({
        status: "success",
        message: "Sent a verification code successfully",
        data: existingUser,
        otp: otp,
      });
    };

    if (source === "volunteer") {
      // Logic specific to volunteer sign up page
      existingUser = await User.findOne({ email });

      if (existingUser && existingUser.isActive && existingUser.password) {
        return res.status(200).json({
          status: "fail",
          message: "User already exists. Please login with your credential.",
          data: existingUser,
        });
      } else {
        return await sendOtpAndRespond();
      }
    } else if (source === "register") {
      // Logic specific to register page
      console.log("Register page");
      const query = User.findOne({ email });
      query._activeFilterDisabled = true;
      existingUser = await query.lean();

      if (existingUser && existingUser.isActive && existingUser.password) {
        console.log("Register page2");

        return res.status(200).json({
          status: "fail",
          message: "User already exists. Please login with your credential.",
          data: existingUser,
        });
      } else if (existingUser && existingUser.isPaid === false) {
        console.log("Register page3");

        return res.status(200).json({
          status: "fail",
          message: "Please purchase membership again to renew your membership.",
          data: existingUser,
          link: "/membership",
        });
      } else if (!existingUser) {
        console.log("Register page4");

        return res.status(200).json({
          status: "fail",
          message: "Please purchase a membership to become a member before signing up.",
          data: existingUser,
          link: "/membership",
        });
      } else {
        console.log("Register page5");

        return await sendOtpAndRespond();
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(200).json({
        status: "fail",
        message: "Invalid OTP. Please try again",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
};
