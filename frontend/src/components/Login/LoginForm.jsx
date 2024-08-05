import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import "./Login.css";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import BaseURL from "../../config";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgetPwdModal, setShowForgetPwdModal] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalEmailError, setModalEmailError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [link, setLink] = useState("");

  const EyeIcon = showPassword ? FaEye : FaEyeSlash;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!isValidEmail(modalEmail)) {
      setModalEmailError("Please enter a valid email address.");
    } else {
      setModalEmailError("");
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setModalEmail(email);
  };

  const validate = (email) => {
    let isValid = true;
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }
    return isValid;
  };

  const modalEmailValidate = (modalEmail) => {
    let isValid = true;
    if (!isValidEmail(modalEmail)) {
      setModalEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setModalEmailError("");
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate(email)) {
      try {
        const response = await axios.post(`${BaseURL}/api/auth/login`, { email, password });
        if (response.data.status === "success") {
          // Get JWT from backend and save it in the localStorage
          const token = response.data.token;
          localStorage.setItem("token", token);

          setLoginError("");
          setLoginSuccessMessage("You have successfully logged in!");
          setRedirectUrl(response.data.redirectUrl);
        } else if (response.data.status === "fail") {
          setLoginError(response.data.message);
          if (response.data.link) {
            setLink(response.data.link);
          }
          console.log(loginError);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (modalEmailValidate(modalEmail)) {
      try {
        const response = await axios.post(`${BaseURL}/api/auth/forgetPassword`, { email: modalEmail });
        if (response.data.status === "success") {
          setFailMessage("");
          setSuccessMessage(response.data.message);
        } else {
          setSuccessMessage("");
          setFailMessage("Failed to send password reset email.");
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setFailMessage(error.response.data.message);
        } else {
          console.error("Error sending reset email:", error);
          setFailMessage("An error occurred. Please try again later.");
        }
      }
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgetPwdModal(true);
  };

  const closeForgetPasswordModal = () => {
    setShowForgetPwdModal(false);
  };

  useEffect(() => {
    if (redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000); // redirect after 3 seconds
    }
  }, [redirectUrl]);

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {loginSuccessMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {loginSuccessMessage}
          </Alert>
        )}
        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
            {link && (
              <a href={link} style={{ display: "block", marginTop: "10px" }}>
                Click here to purchase a membership.
              </a>
            )}
          </Alert>
        )}
        <div className="input-box">
          <FaUser className="icon" />
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {emailError && <p className="error">{emailError}</p>}
        <div className="input-box">
          <FaLock className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <EyeIcon onClick={togglePasswordVisibility} className="eye-icon" />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember me
          </label>
          <a onClick={handleForgotPasswordClick}>Forgot password?</a>
        </div>

        <button type="submit">Login</button>

        <div className="register-link">
          <p>
            Don't have an account? <a href="/Register">Sign up</a>
          </p>
        </div>
      </form>

      {showForgetPwdModal && (
        <div className="forget-pwd-modal">
          <div className="forget-pwd-modal-content">
            <span className="close" onClick={closeForgetPasswordModal}>
              &times;
            </span>
            <h2>Reset Password</h2>
            <Alert severity="info" sx={{ mb: 2 }}>
              Enter your email to reset your password.
            </Alert>
            <form onSubmit={handleEmailSubmit}>
              <div className="input-box">
                <FaEnvelope className="icon" />
                <input
                  type="text"
                  placeholder="Email"
                  value={modalEmail}
                  onChange={handleEmailChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={modalEmailError && !isFocused ? "error-input" : ""}
                  required
                />
              </div>
              {/* {modalEmailError && !isFocused && <p className="error-text">{modalEmailError}</p>} */}
              {modalEmailError && <p className="error-text">{modalEmailError}</p>}
              {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
              )}
              {failMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {failMessage}
                </Alert>
              )}
              <button className="register-button" type="submit">
                Send Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
