import React, { useState, useEffect, useContext } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import BaseURL from "../../config";
import { getSafeRedirectUrl } from "../../utils/urlValidation";
import { UserContext } from "../../UserContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgetPwdModal, setShowForgetPwdModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalEmailError, setModalEmailError] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [link, setLink] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const isValidEmail = (e) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setEmailError("Please enter a valid email address."); return; }
    setEmailError("");
    try {
      const response = await axios.post(`${BaseURL}/api/auth/login`, { email, password });
      if (response.data.status === "success") {
        const token = response.data.token;
        localStorage.setItem("token", token);
        // Fetch user info and set context
        const userRes = await axios.get(`${BaseURL}/api/user/userinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.data.status === "success") {
          login({ ...userRes.data.data.user, token });
        }
        setLoginError("");
        setLoginSuccessMessage("You have successfully logged in!");
        setRedirectUrl(response.data.redirectUrl || location.state?.from?.pathname || "/");
      } else if (response.data.status === "fail") {
        setLoginError(response.data.message);
        if (response.data.link) setLink(response.data.link);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(modalEmail)) { setModalEmailError("Please enter a valid email address."); return; }
    try {
      const response = await axios.post(`${BaseURL}/api/auth/forgetPassword`, { email: modalEmail });
      if (response.data.status === "success") {
        setFailMessage(""); setSuccessMessage(response.data.message);
      } else {
        setSuccessMessage(""); setFailMessage("Failed to send password reset email.");
      }
    } catch (error) {
      setFailMessage(error.response?.data?.message || "An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    if (redirectUrl) {
      setTimeout(() => {
        navigate(getSafeRedirectUrl(redirectUrl));
      }, 2000);
    }
  }, [redirectUrl, navigate]);

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight={700}>Login</Typography>
        {loginSuccessMessage && <Alert severity="success" sx={{ mb: 2 }}>{loginSuccessMessage}</Alert>}
        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
            {link && <Link href={link} display="block" mt={1}>Click here to purchase a membership.</Link>}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}
            required fullWidth error={!!emailError} helperText={emailError}
            InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
          />
          <TextField
            label="Password" type={showPassword ? "text" : "password"} value={password}
            onChange={(e) => setPassword(e.target.value)} required fullWidth
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
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Link component="button" type="button" onClick={() => setShowForgetPwdModal(true)} underline="hover">
              Forgot password?
            </Link>
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth size="large">Login</Button>
          <Divider />
          <Typography align="center" variant="body2">
            Don&apos;t have an account?{" "}
            <Link href="/register" underline="hover">Sign up</Link>
          </Typography>
        </Box>
      </Paper>

      <Dialog open={showForgetPwdModal} onClose={() => setShowForgetPwdModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>Enter your email to reset your password.</Alert>
          <Box component="form" onSubmit={handleEmailSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Email" type="text" value={modalEmail}
              onChange={(e) => setModalEmail(e.target.value)}
              required fullWidth error={!!modalEmailError} helperText={modalEmailError}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
            />
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {failMessage && <Alert severity="error">{failMessage}</Alert>}
            <Button type="submit" variant="contained" color="primary" fullWidth>Send Link</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default LoginForm;
