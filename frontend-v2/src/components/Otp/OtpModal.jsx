import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import InputAdornment from "@mui/material/InputAdornment";

const OtpModal = ({ otp, setOtp, otpError, handleOtpSubmit, setShowOtpModal }) => {
  return (
    <Dialog open={true} onClose={() => setShowOtpModal(false)} maxWidth="xs" fullWidth>
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogContent>
        <Alert severity="success" sx={{ mb: 2 }}>
          We&apos;ve sent a verification code to your email
        </Alert>
        <TextField
          fullWidth
          label="OTP Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />
        {otpError && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
            {otpError}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowOtpModal(false)}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleOtpSubmit}>
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpModal;
