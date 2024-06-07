// RegisterModal.js
import React from "react";
import { Modal, Box, Button, TextField } from "@mui/material";

const RegisterModal = ({ open, onClose }) => {
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
          <TextField id="email" label="Email" variant="outlined" fullWidth />
          <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
            Continue
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default RegisterModal;
