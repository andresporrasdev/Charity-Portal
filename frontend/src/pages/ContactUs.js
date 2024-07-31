import React from "react";
import "./Contact.css";
import { FaFacebook, FaInstagram } from "react-icons/fa";

function ContactUs() {
  return (
    <div className="contact-container">
      <div className="contact-info">
        <h1>Contact us</h1>
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
        <form>
          <div className="input-box">
            <label htmlFor="lastName"> Name (required)</label>
            <input type="text" id="name" placeholder="name" required />
          </div>
          <div className="input-box">
            <label htmlFor="email">Email (required)</label>
            <input type="email" id="email" placeholder="Email" required />
          </div>
          <div className="input-box">
            <label htmlFor="message">Message (required)</label>
            <textarea id="message" placeholder="Enter your message" required></textarea>
          </div>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
