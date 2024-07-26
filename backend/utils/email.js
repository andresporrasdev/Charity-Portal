const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SENDING_ADDRESS = process.env.SENDING_ADDRESS;
let REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (options) => {
  try {
    // Convert a single email object to an array
    if (!Array.isArray(options)) {
      options = [options];
    }

    const accessToken = await oauth2Client.getAccessToken();

    // Nodemailer
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDING_ADDRESS,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const results = [];

    for (const option of options) {
      const mailOptions = {
        from: SENDING_ADDRESS,
        to: option.email,
        subject: option.subject,
        text: option.text,
        html: option.html,
        attachments: option.attachments,
      };

      const result = await transport.sendMail(mailOptions);
      console.log("Email sent:", result);
      results.push(result);
    }
    return results;
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
};

module.exports = sendEmail;
