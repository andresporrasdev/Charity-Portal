import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import BaseURL from "../../config";
import Editor from "../Editor/Editor";
import axios from "axios";
import {
  TextField,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const NotifyVolunteerForm = ({ open, onClose }) => {
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [emailList, setEmailList] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectError, setSubjectError] = useState("");
  const [messageBodyError, setMessageBodyError] = useState("");
  const [emailListError, setEmailListError] = useState("");
  const [eventError, setEventError] = useState("");

  useEffect(() => {
    axios.get(`${BaseURL}/api/event/readEvent`)
      .then((r) => {
        const futureEvents = r.data
          .filter((e) => new Date(e.time) >= new Date())
          .sort((a, b) => new Date(b.time) - new Date(a.time));
        setEvents(futureEvents);
      })
      .catch(() => toast.error("Failed to fetch events"));
  }, []);

  const isInvalidBody = () => {
    const trimmedText = messageBody.trim();
    return !trimmedText || /^(<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>)*$/gm.test(trimmedText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    setSubjectError(""); setMessageBodyError(""); setEmailListError(""); setEventError("");

    if (!selectedEvent) { setEventError("Event selection is required"); hasError = true; }
    if (!emailList.trim()) { setEmailListError("Email list is required"); hasError = true; }
    if (!subject.trim()) { setSubjectError("Subject is required"); hasError = true; }
    if (!messageBody.trim() || isInvalidBody()) { setMessageBodyError("Message body is required"); hasError = true; }
    if (hasError) return;

    setLoading(true);
    const emailArray = emailList.split(",").map((e) => e.trim()).filter(Boolean);

    try {
      const response = await axios.post(
        `${BaseURL}/api/volunteer/notify-volunteers`,
        { subject, messageBody, emails: emailArray },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.status === 200) {
        toast.success("Notification published successfully");
        setTimeout(() => {
          setSubject(""); setMessageBody(""); setEmailList(""); onClose();
        }, 2000);
      } else {
        toast.error(`Error: ${response.data}`);
      }
    } catch {
      toast.error("Failed to send notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    if (eventId) {
      setEventError("");
      try {
        const response = await axios.get(`${BaseURL}/api/volunteer/getVolunteersByEventId/${eventId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const emails = [...new Set(response.data.data.volunteers.map((v) => v.email))].join(", ");
        setEmailList(emails);
        setEmailListError("");
      } catch {
        toast.error("Failed to fetch emails");
      }
    } else {
      setEmailList("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ minHeight: "100vh", maxHeight: "80vh" }}>
      <DialogTitle>Notify Volunteers</DialogTitle>
      <DialogContent sx={{ minHeight: "40vh" }}>
        <Grid container spacing={1}>
          <Grid item xs={12} mt={1}>
            <FormControl required fullWidth error={!!eventError}>
              <InputLabel>Event</InputLabel>
              <Select label="Event *" value={selectedEvent} onChange={handleChange} required>
                <MenuItem value=""><em>Select Event</em></MenuItem>
                {events.map((event) => (
                  <MenuItem key={event._id} value={event._id}>{event.name}</MenuItem>
                ))}
              </Select>
              {eventError && <FormHelperText>{eventError}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} mt={1}>
            <TextField required id="to" label="To" value={emailList}
              onChange={(e) => setEmailList(e.target.value)} fullWidth
              error={!!emailListError} helperText={emailListError} />
          </Grid>
          <Grid item xs={12} mb={1} mt={1}>
            <TextField required id="subject" label="Subject" value={subject}
              onChange={(e) => setSubject(e.target.value)} fullWidth
              error={!!subjectError} helperText={subjectError} />
          </Grid>
          <Grid item xs={12}>
            <Editor value={messageBody} onEditorChange={(v) => setMessageBody(v)} placeholder="Enter description" />
            {messageBodyError && <Typography color="error" variant="caption" sx={{ ml: 1 }}>{messageBodyError}</Typography>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between", mb: 2, p: 0, mt: 2 }}>
        <Button variant="contained" color="primary" startIcon={<SendIcon />} onClick={handleSubmit} disabled={loading} sx={{ ml: 3 }}>
          {loading ? <CircularProgress size={24} /> : "Send Email"}
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button onClick={onClose} variant="contained" color="primary" sx={{ mr: 4 }}>Cancel</Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default NotifyVolunteerForm;
