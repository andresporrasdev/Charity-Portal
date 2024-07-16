// OTPModal.js
import React from "react";
import { FaLock } from "react-icons/fa";
import Alert from "@mui/material/Alert";
import "./OtpModal.css";

const OtpModal = ({ otp, setOtp, otpError, handleOtpSubmit, setShowOtpModal }) => {
  return (
    <div className="otp-modal">
      <div className="otp-modal-content">
        <span className="close" onClick={() => setShowOtpModal(false)}>
          &times;
        </span>
        <h2>Enter OTP</h2>
        <Alert severity="success" sx={{ mb: 2 }}>
          We've sent a verification code to your email
        </Alert>
        <form onSubmit={handleOtpSubmit}>
          <div className="modal-input-box">
            <FaLock className="icon" />
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          {otpError && <p className="error-text">{otpError}</p>}
          <button className="modal-button" type="submit">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpModal;
