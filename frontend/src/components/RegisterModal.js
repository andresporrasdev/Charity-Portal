import React, { useState } from "react";
import { Modal, Box, Button, TextField } from "@mui/material";
import axios from "axios";

const RegisterModal = ({ open, onClose }) => {
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
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 300,
            maxWidth: "90%",
          }}
        >
          <h2 id="register-modal-title">Register</h2>
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
          />
          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            Continue
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default RegisterModal;
