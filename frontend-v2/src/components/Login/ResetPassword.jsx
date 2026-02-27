import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
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
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { getSafeRedirectUrl } from "../../utils/urlValidation";

const ResetPassword = ({ token }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValidPassword = (pw) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{6,}$/.test(pw);

  const validate = () => {
    let isValid = true;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 6 chars with uppercase, lowercase, number, and special char.");
      isValid = false;
    } else {
      setPasswordError("");
    }
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
        const response = await axiosInstance.patch(`/api/auth/resetPassword/${token}`, { password, confirmPassword });
        if (response.data.status === "success") {
          setErrorMessage(""); setSuccessMessage(response.data.message);
          setRedirectUrl(response.data.redirectUrl);
        } else {
          setSuccessMessage(""); setErrorMessage(response.data.message);
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || "An error occurred.");
      }
    }
  };

  useEffect(() => {
    if (redirectUrl) {
      setTimeout(() => navigate(getSafeRedirectUrl(redirectUrl)), 3000);
    }
  }, [redirectUrl, navigate]);

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight={700}>Password Reset</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>Please reset your password.</Alert>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="New Password" type={showPassword ? "text" : "password"}
            value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(!isValidPassword(e.target.value)); }}
            required fullWidth error={!!passwordError} helperText={passwordError}
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
            value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(password !== e.target.value); }}
            required fullWidth error={!!confirmPasswordError} helperText={confirmPasswordError ? "Passwords do not match." : ""}
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
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth size="large">Reset Password</Button>
          <Typography align="center" variant="body2">
            <Link href="/login" underline="hover">Go back to login</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
