import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  Container,
  Link,
} from "@mui/material";
import OtpModal from "../Otp/OtpModal";
import { UserContext } from "../../UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VolunteerSignUpForm = () => {
  const navigate = useNavigate();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [formData, setFormData] = useState({
    name: "", email: "", contactNumber: "", preferredRole: "",
    event: "", parentName: "", agreePolicies: false, understandUnpaid: false,
  });
  const [errors, setErrors] = useState({});
  const [events, setEvents] = useState([]);
  const location = useLocation();
  const [roles, setRoles] = useState([]);

  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/user/userinfo");
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: `${response.data.data.user.first_name} ${response.data.data.user.last_name}`,
          email: response.data.data.user.email,
          userId: user._id,
        }));
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUserInfo();

    axiosInstance.get("/api/volunteerRole/getAllVolunteerRoles")
      .then((r) => setRoles(r.data.data.roles))
      .catch((e) => console.error("Error fetching volunteer roles:", e));

    axiosInstance.get("/api/event/readEvent")
      .then((r) => {
        const futureEvents = r.data.data.events
          .filter((e) => new Date(e.time) >= new Date())
          .sort((a, b) => new Date(b.time) - new Date(a.time));
        setEvents(futureEvents);
        if (location.state?.eventId) {
          setFormData((prev) => ({ ...prev, event: location.state.eventId }));
        }
      })
      .catch((e) => console.error("Error fetching events:", e));

    if (user) setIsEmailVerified(true);
  }, [location.state, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: !value ? "Email is required" : !emailPattern.test(value) ? "Please enter a valid email address" : "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const phonePattern = /^[0-9]{10}$/;
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailPattern.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.contactNumber) newErrors.contactNumber = "Contact Number is required";
    else if (!phonePattern.test(formData.contactNumber)) newErrors.contactNumber = "Contact number must be 10 digits";
    if (!formData.preferredRole) newErrors.preferredRole = "Preferred Role is required";
    if (!formData.event) newErrors.event = "Event is required";
    if (!formData.agreePolicies) newErrors.agreePolicies = "You must agree to the policies";
    if (!formData.understandUnpaid) newErrors.understandUnpaid = "You must understand the volunteer position is unpaid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) { setVerifyError("Please verify your email before submitting."); return; }
    if (validateForm()) {
      try {
        await axiosInstance.post("/api/volunteer/volunteerSignUp", formData);
        alert("Volunteer signed up successfully!\nPress OK to return to the events page");
        navigate("/event");
      } catch (error) {
        console.error("Error signing up volunteer:", error);
      }
    }
  };

  const handleClearForm = () => {
    setFormData({ name: "", email: "", contactNumber: "", preferredRole: "", event: "", parentName: "", agreePolicies: false, understandUnpaid: false });
    setIsEmailVerified(false);
    setErrors({});
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setVerifyError("");
    try {
      const response = await axiosInstance.post("/api/otp/send-otp", { email: formData.email, source: "volunteer" });
      if (response.data.status === "success") setShowOtpModal(true);
      else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/otp/verify-otp", { email: formData.email, otp });
      if (response.data.status === "success") {
        setIsEmailVerified(true); setShowOtpModal(false); setOtpError("");
        alert("OTP verified successfully!");
      } else {
        setOtpError(response.data.message);
      }
    } catch (error) {
      setOtpError(error.response?.data?.status || "OTP verification failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Volunteer Sign-Up</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange}
            required fullWidth error={!!errors.name} helperText={errors.name} />

          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange}
              required fullWidth error={!!errors.email} helperText={errors.email} disabled={isEmailVerified} />
            {!isEmailVerified ? (
              <Button variant="outlined" color="primary" onClick={handleVerify}
                disabled={!formData.email || !emailPattern.test(formData.email)} sx={{ whiteSpace: "nowrap", mt: "8px", height: 56 }}>
                Verify
              </Button>
            ) : (
              <Button variant="contained" color="success" disabled sx={{ whiteSpace: "nowrap", mt: "8px", height: 56 }}>
                Verified!
              </Button>
            )}
          </Box>
          {verifyError && <Alert severity="error">{verifyError}</Alert>}
          {loading && <CircularProgress size={24} sx={{ alignSelf: "center" }} />}

          <TextField label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange}
            required fullWidth error={!!errors.contactNumber} helperText={errors.contactNumber} />

          <FormControl required fullWidth error={!!errors.preferredRole}>
            <InputLabel>Preferred Role</InputLabel>
            <Select name="preferredRole" value={formData.preferredRole} onChange={handleChange} label="Preferred Role">
              <MenuItem value=""><em>Select Role</em></MenuItem>
              {roles.map((role) => (
                <MenuItem key={role._id} value={role._id}>{role.name}: {role.description}</MenuItem>
              ))}
            </Select>
            {errors.preferredRole && <Typography variant="caption" color="error">{errors.preferredRole}</Typography>}
          </FormControl>

          <FormControl required fullWidth error={!!errors.event}>
            <InputLabel>Event</InputLabel>
            <Select name="event" value={formData.event} onChange={handleChange} label="Event">
              <MenuItem value=""><em>Select Event</em></MenuItem>
              {events.map((event) => (
                <MenuItem key={event._id} value={event._id}>{event.name}</MenuItem>
              ))}
            </Select>
            {errors.event && <Typography variant="caption" color="error">{errors.event}</Typography>}
          </FormControl>

          <TextField label="Parent Name (OTS Member)" name="parentName" value={formData.parentName} onChange={handleChange} fullWidth />

          <FormControlLabel
            control={<Checkbox name="agreePolicies" checked={formData.agreePolicies} onChange={handleChange} color="primary" />}
            label={
              <Typography variant="body2">
                I agree to abide by the{" "}
                <Link href="/policy" target="_blank" rel="noopener noreferrer">policies and guidelines</Link>
                {" "}of Charity Organization Portal
              </Typography>
            }
          />
          {errors.agreePolicies && <Typography variant="caption" color="error">{errors.agreePolicies}</Typography>}

          <FormControlLabel
            control={<Checkbox name="understandUnpaid" checked={formData.understandUnpaid} onChange={handleChange} color="primary" />}
            label="I understand that my volunteer position is unpaid and does not imply any employment relationship."
          />
          {errors.understandUnpaid && <Typography variant="caption" color="error">{errors.understandUnpaid}</Typography>}

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
            </Grid>
            <Grid item xs={6}>
              <Button type="button" variant="outlined" onClick={handleClearForm} fullWidth>Clear Form</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {showOtpModal && (
        <OtpModal otp={otp} setOtp={setOtp} otpError={otpError} handleOtpSubmit={handleOtpSubmit} setShowOtpModal={setShowOtpModal} />
      )}
      <ToastContainer />
    </Container>
  );
};

export default VolunteerSignUpForm;
