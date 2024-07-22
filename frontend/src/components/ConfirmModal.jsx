import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

const ConfirmModal = ({ title, text, open, onConfirm, onClose, confirmWord }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConfirm = () => {
    if (inputValue === confirmWord) {
      onConfirm();
    } else {
      alert("The confirmation word does not match.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
        <TextField
          label={`Type "${confirmWord}" to confirm`}
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} disabled={inputValue !== confirmWord}>Delete</Button>
        <Button onClick={onClose} autoFocus>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
