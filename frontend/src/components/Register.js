import React, { useState } from "react";
import './Register.css';
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
// import axios from "axios"; // Commented out for testing

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [additionalFieldsVisible, setAdditionalFieldsVisible] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const passwordsMatch = (password1, password2) => {
    return password1 === password2;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!isValidEmail(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(!isValidPassword(e.target.value));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(!passwordsMatch(password, e.target.value));
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      console.log("Invalid email:", email);
      return;
    }
    console.log("email:", email);
    // Mocking the API response
    // try {
    //   const response = await axios.post("http://localhost:3000/api/user/check", { email });
    //   console.log(response);
    //   console.log("user data saved!");
    //   // If registration is successful, show OTP modal
    //   setShowOtpModal(true);
    // } catch (error) {
    //   console.error(error);
    // }
    console.log("Mock API call: User data saved!");
    setShowOtpModal(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log('OTP submitted:', otp);
    // Mocking the API response
    // try {
    //   const response = await axios.post("http://localhost:3000/api/user/verify-otp", { email, otp });
    //   console.log(response);
    //   if (response.data.resetPassword) {
    //     window.location.href = "/resetPassword";
    //   } else {
    //     setAdditionalFieldsVisible(true);
    //     setShowOtpModal(false);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
    console.log("Mock API call: OTP verified!");
    // Mock response
    const mockResponse = { resetPassword: false };
    if (mockResponse.resetPassword) {
      window.location.href = "/ResetPassword.js";
    } else {
      setAdditionalFieldsVisible(true);
      setShowOtpModal(false);
    }
  };
  
  const handleCompleteRegistration = async () => {
    console.log("Complete Registration");
    // Handle the completion of registration here
    if (!isValidPassword(password)) {
      console.log("Password does not meet complexity requirements");
      return;
    }

    if (!passwordsMatch(password, confirmPassword)) {
      console.log("Passwords do not match");
      return;
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2 id="register-modal-title">Register</h2>
        <div className="input-box">
          <FaEnvelope className='icon' />
          <input
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={emailError && !isFocused ? "error-input" : ""}
          />
        </div>
        {emailError && !isFocused && <p className="error-text">Please enter a valid email address.</p>}
        {!additionalFieldsVisible && (
          <button className="register-button" onClick={handleSubmit}>Continue</button>
        )}
        {additionalFieldsVisible && (
          <>
            <div className="input-box">
              <FaUser className='icon' />
              <input type="text" placeholder="Firstname" required />
            </div>
            <div className="input-box">
              <FaUser className='icon' />
              <input type="text" placeholder="Lastname" required />
            </div>
            <div className="input-box">
              <FaLock className='icon' />
              <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} required
                className={passwordError ? "error-input" : ""} />
            </div>
            {passwordError && <p className="error-text">Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.</p>}
            <div className="input-box">
              <FaLock className='icon' />
              <input type="password" placeholder="Confirm Password" onChange={handleConfirmPasswordChange} required
                className={confirmPasswordError ? "error-input" : ""} />
            </div>
            {confirmPasswordError && <p className="error-text">Passwords do not match.</p>}
            <button className="register-button" onClick={handleCompleteRegistration}>Complete Registration</button>
          </>
        )}
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <span className="close" onClick={() => setShowOtpModal(false)}>&times;</span>
            <h2>Enter OTP</h2>
            <form onSubmit={handleOtpSubmit}>
              <div className="input-box">
                <FaLock className='icon' />
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>
              <button className="register-button" type="submit">Verify</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;