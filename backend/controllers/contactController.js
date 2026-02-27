const { sendEmail } = require("../utils/email");

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

exports.sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  // Input validation
  if (!name || !email || !message) {
    return res.status(400).json({ status: "fail", message: "Name, email, and message are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ status: "fail", message: "Invalid email address." });
  }

  if (message.length > 2000) {
    return res.status(400).json({ status: "fail", message: "Message must be 2000 characters or fewer." });
  }

  // Sanitize before injecting into HTML
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  const userConfirmationEmail = {
    email,
    subject: "Thank you for contacting us!",
    text: `Hi ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nCharity Organization`,
    html: `<p>Hi ${safeName},</p><p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p><p>Best regards,<br>Charity Organization</p>`,
  };

  const adminNotificationEmail = {
    email: process.env.SENDING_ADDRESS,
    subject: `New Message from ${safeName} via Contact Form`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong> ${safeMessage}</p>`,
  };

  try {
    await sendEmail([userConfirmationEmail, adminNotificationEmail]);
    res.status(200).json({ status: "success", message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ status: "error", message: "Error sending emails." });
  }
};
