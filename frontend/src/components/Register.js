import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!isValidEmail(e.target.value));
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      console.log("Invalid email:", email);
      return;
    }
    console.log("email:", email);
    try {
      const response = await axios.post("http://localhost:3000/api/user/check", { email });
      console.log(response);
      console.log("user data saved!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "transparent",
          border: "2px solid rgba(255, 255, 255, .2)",
          backdropFilter: "blur(30px)",
          boxShadow: "0 0 10px rgba(0, 0, 0, .2)",
          color: "#333",
          borderRadius: "10px",
          padding: "30px 40px",
          width: 420,
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <h2 id="register-modal-title">Register</h2>
        <div className="input-box">
              <TextField
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={handleEmailChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              error={emailError && !isFocused}
              helperText={emailError && !isFocused ? "Please enter the valid email address." : ""}
              sx={{ border: "none", "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" } }}
            />
        </div>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
              mt: 2,
              width: "100%",
              height: "50px",
              background: "#e88a1d",
              border: "none",
              outline: "none",
              borderRadius: "40px",
              boxShadow: "0 0 10px rgba(0, 0, 0, .1)",
              cursor: "pointer",
              fontSize: "16px",
              color: "white",
              fontWeight: 700,
              "&:hover": {background: "#e88a1d", },
            }}>
          Continue
        </Button>
        </Box>
    </div>
  );
};

export default Register;
