import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  Divider,
  Link,
  CircularProgress,
} from "@mui/material";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import BaseURL from "../config";

function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BaseURL}/api/contact/send-contact-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setAlert({ message: "Message sent successfully!", type: "success" });
      } else {
        setAlert({ message: "Failed to send message.", type: "error" });
      }
    } catch (error) {
      setAlert({ message: "An error occurred while sending the message.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Contact Us</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
        {/* Info panel */}
        <Paper sx={{ p: 4, bgcolor: "secondary.main", color: "white" }}>
          <Typography variant="h6" gutterBottom>Get in Touch</Typography>
          <Typography variant="body1" paragraph>
            We would love to hear your thoughts and suggestions! Feel free to drop us an email at{" "}
            <strong>CharityOrganization@gmail.com</strong>
          </Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.3)", my: 2 }} />
          <Typography variant="body1" gutterBottom>Or follow us on social media:</Typography>
          <Box sx={{ display: "flex", gap: 2, fontSize: "1.8rem", mt: 1 }}>
            <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" color="inherit">
              <FaFacebook />
            </Link>
            <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" color="inherit">
              <FaInstagram />
            </Link>
          </Box>
        </Paper>

        {/* Form */}
        <Paper sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField id="name" label="Name" required value={formData.name} onChange={handleChange} fullWidth />
            <TextField id="email" label="Email" type="email" required value={formData.email} onChange={handleChange} fullWidth />
            <TextField id="message" label="Message" required value={formData.message} onChange={handleChange} fullWidth multiline rows={5} />
            <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Send Message"}
            </Button>
          </Box>
          {alert.message && <Alert severity={alert.type} sx={{ mt: 2 }}>{alert.message}</Alert>}
        </Paper>
      </Box>
    </Container>
  );
}

export default ContactUs;
