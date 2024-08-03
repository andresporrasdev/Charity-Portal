import React, { useState } from "react";
import "./Contact.css";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import Alert from "@mui/material/Alert";
import BaseURL from "../config";
import { CircularProgress } from "@mui/material";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BaseURL}/api/contact/send-contact-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setAlert({ message: "Message sent successfully!", type: "success" });
      } else {
        setAlert({ message: "Failed to send message.", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({ message: "An error occurred while sending the message.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact us</h1>
      <div className="contact-info">
        <p>
          We would love to hear your thoughts and suggestions! Feel free to drop us an email at{" "}
          <strong>ottawatamilsangam@gmail.com</strong>
        </p>
        <br />
        <p>-OR-</p>
        <p>Follow and chat with us on social media!</p>
        <div className="social-icons">
          <a href="https://www.facebook.com/TamilSangamofOttawa" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/ottawatamilsangam/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </div>
      </div>
      <div className="contact-form">
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label htmlFor="name">Name (required)</label>
            <input type="text" id="name" placeholder="name" required value={formData.name} onChange={handleChange} />
          </div>
          <div className="input-box">
            <label htmlFor="email">Email (required)</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <label htmlFor="message">Message (required)</label>
            <textarea
              id="message"
              placeholder="Enter your message"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Send Email"}
          </button>
        </form>
        {alert.message && (
          <Alert severity={alert.type} style={{ marginTop: "20px" }}>
            {alert.message}
          </Alert>
        )}
      </div>
    </div>
  );
}

export default ContactUs;
