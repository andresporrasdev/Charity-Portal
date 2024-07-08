const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });
const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const emailOptions = {
    from: process.env.MAIL_USER,
    to: option.email,
    subject: option.subject,
    text: option.text,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
