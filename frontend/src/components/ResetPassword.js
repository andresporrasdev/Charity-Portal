import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import axios from "axios";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Alert from "@mui/material/Alert";

const ResetPassword = ({ token }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const EyeIcon = showPassword ? FaEye : FaEyeSlash;
  const ConfirmEyeIcon = showConfirmPassword ? FaEye : FaEyeSlash;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const passwordsMatch = (password1, password2) => {
    return password1 === password2;
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(!isValidPassword(e.target.value));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(!passwordsMatch(password, e.target.value));
  };

  const validate = () => {
    let isValid = true;

    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "New password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Validate password match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.patch(`http://localhost:3000/api/auth/resetPassword/${token}`, {
          password,
          confirmPassword,
        });
        if (response.data.status === "success") {
          setErrorMessage("");
          setSuccessMessage(response.data.message);
          setRedirectUrl(response.data.redirectUrl);
        } else if (response.data.status === "fail") {
          setSuccessMessage("");
          setErrorMessage("Failed to reset password.");
        }
        console.log("Password reset successful:", response.data);
      } catch (err) {
        setErrorMessage("Failed to reset password.");
        console.error("Password reset error:", err);
      }
    }
  };

  useEffect(() => {
    if (redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000);
    }
  }, [redirectUrl]);

  return (
    <div className="reset-password-wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Password Reset</h1>
        <Alert severity="info" sx={{ mb: 2 }}>
          Please reset your password.
        </Alert>
        <div className="input-box">
          <FaLock className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={handlePasswordChange}
            required
            className={passwordError ? "error-input" : ""}
          />
          <EyeIcon onClick={togglePasswordVisibility} className="eye-icon" />
        </div>
        {passwordError && <p className="error-text">{passwordError}</p>}

        <div className="input-box">
          <FaLock className="icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className={confirmPasswordError ? "error-input" : ""}
          />
          <ConfirmEyeIcon onClick={toggleConfirmPasswordVisibility} className="eye-icon" />
        </div>
        {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        <button type="submit">Reset Password</button>

        <div className="link">
          <p>
            <a href="/login">Go back</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
