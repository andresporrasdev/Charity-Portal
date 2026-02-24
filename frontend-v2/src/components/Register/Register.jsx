import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Email } from "@mui/icons-material";
import OtpModal from "../Otp/OtpModal";
import BaseURL from "../../config";
import { getSafeRedirectUrl } from "../../utils/urlValidation";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [additionalFieldsVisible, setAdditionalFieldsVisible] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupMessage, setSignupMessage] = useState("");
  const [link, setLink] = useState("");

  const isValidEmail = (e) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e);
  const isValidPassword = (p) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{6,}$/.test(p);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!isValidEmail(e.target.value) ? "Please enter a valid email address." : "");
    setLink("");
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) { setEmailError("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      const response = await axios.post(`${BaseURL}/api/otp/send-otp`, { email, source: "register" });
      if (response.data.status === "success") {
        setShowOtpModal(true);
      } else if (response.data.status === "fail") {
        setEmailError(response.data.message);
        if (response.data.link) setLink(response.data.link);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BaseURL}/api/otp/verify-otp`, { email, otp });
      if (response.data.status === "success") {
        setOtpError(""); setAdditionalFieldsVisible(true); setShowOtpModal(false);
      } else {
        setOtpError("OTP is not valid, please try again.");
        setOtp("");
      }
    } catch (error) { console.error(error); }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (!isValidPassword(password)) return;
    if (password !== confirmPassword) return;
    try {
      const response = await axios.post(`${BaseURL}/api/auth/signup`, { email, password });
      if (response.data.status === "success") {
        setSignupMessage("Successfully signed up! Redirecting to login page...");
        setRedirectUrl(response.data.redirectUrl);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (redirectUrl) {
      setTimeout(() => navigate(getSafeRedirectUrl(redirectUrl)), 3000);
    }
  }, [redirectUrl, navigate]);

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight={700}>Register</Typography>
        {signupMessage && <Alert severity="success" sx={{ mb: 2 }}>{signupMessage}</Alert>}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email" type="text" value={email}
            onChange={handleEmailChange} required fullWidth
            error={!!emailError}
            helperText={emailError ? (
              <>
                {emailError}
                {link && <Link href={link} display="block" mt={0.5}>Click here to purchase a membership.</Link>}
              </>
            ) : ""}
            disabled={additionalFieldsVisible}
            InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
          />
          {loading && <CircularProgress size={24} sx={{ alignSelf: "center" }} />}
          {!additionalFieldsVisible && (
            <>
              <Button variant="contained" color="primary" fullWidth size="large" onClick={handleSubmit}>
                Continue
              </Button>
              <Divider />
              <Typography align="center" variant="body2">
                Already have an account?{" "}
                <Link href="/login" underline="hover">Login</Link>
              </Typography>
            </>
          )}
          {additionalFieldsVisible && (
            <Box component="form" onSubmit={handleCompleteRegistration} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Password" type={showPassword ? "text" : "password"}
                value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(!isValidPassword(e.target.value)); }}
                required fullWidth error={passwordError}
                helperText={passwordError ? "Must be ≥6 chars with uppercase, lowercase, number, special char." : ""}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password" type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(password !== e.target.value); }}
                required fullWidth error={confirmPasswordError} helperText={confirmPasswordError ? "Passwords do not match." : ""}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                Complete Registration
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
      {showOtpModal && (
        <OtpModal otp={otp} setOtp={setOtp} otpError={otpError} handleOtpSubmit={handleOtpSubmit} setShowOtpModal={setShowOtpModal} />
      )}
    </Container>
  );
};

export default Register;
