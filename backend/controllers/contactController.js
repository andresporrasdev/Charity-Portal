const { sendEmail } = require("../utils/email");

exports.sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  const userConfirmationEmail = {
    email,
    subject: "Thank you for contacting us!",
    text: `Hi ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nCharity Organization`,
    html: `<p>Hi ${name},</p><p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p><p>Best regards,<br>Charity Organization</p>`,
  };

  const adminNotificationEmail = {
    email: process.env.SENDING_ADDRESS,
    subject: `New Message from ${name} via Contact Form`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
  };

  try {
    await sendEmail([userConfirmationEmail, adminNotificationEmail]);
    res.status(200).json({ status: "Success", message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ status: "error", message: "Error sending emails." });
  }
};
