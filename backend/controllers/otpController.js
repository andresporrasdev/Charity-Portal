const nodemailer = require("nodemailer");
const Otp = require("../models/otp");
const User = require("../models/user");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
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

const sendOTPByEmail = async (email, otp) => {
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
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to", email);
    return otp;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    //const existingUser = await User.findOne({ email });
    const query = User.findOne({ email });
    query._activeFilterDisabled = true;
    const existingUser = await query.lean();

    // if the user already signed up
    if (existingUser && existingUser.isActive && existingUser.password) {
      return res.status(200).json({
        status: "fail",
        message: "User already exists. Please login with your credential.",
        data: existingUser,
      });
    } else if (existingUser && existingUser.isPaid === false) {
      return res.status(200).json({
        status: "fail",
        message: "Please purchase membership again to renew your membership.",
        data: existingUser,
      });
    } else if (!existingUser) {
      return res.status(200).json({
        status: "fail",
        message: "Please purchase membership to be a member before sign up.",
        data: existingUser,
      });
    } else {
      // email exists in db, isActive is false, isPaid is true (when user paid membership but not signed up)
      const otp = generateNumericOTP(6);
      await Otp.create({ email, otp });
      await sendOTPByEmail(email, otp);

      return res.status(200).json({
        status: "success",
        message: "Sent a verifiaction code successfully",
        data: existingUser,
        otp: otp,
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
