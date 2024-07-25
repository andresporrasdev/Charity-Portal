const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SENDING_ADDRESS = process.env.SENDING_ADDRESS;
let REFRESH_TOKEN = process.env.REFRESH_TOKEN; 

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        // Nodemailer 
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: SENDING_ADDRESS,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        // These are the details of the message to send. 
        // 'mailOptions' is nodemailer standard syntax. 
        const mailOptions = {
            from: SENDING_ADDRESS,
            to: 'norm0145@algonquinlive.com',
            bcc: 'tim@timnorman.ca', 
            subject: 'Test Email',
            text: 'This is the plaintext text, which isn\'t as cool',
            html: '<h1>Rich Text Email</h1><p>This is a test email with rich text formatting.</p> <img src="cid:uniqueName"/>',
            attachments: [{
                filename: 'best-beach-ball.jpg',
                path: 'best-beach-ball.jpg',
                cid: 'uniqueName'
            }]
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}

sendMail()
    .then((result) => console.log('Email sent: ', result))
    .catch((error) => console.log(error.message));