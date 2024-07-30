import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import BaseURL from "../../config";
import Editor from "../Post/Editor";
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
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/event/readEvent`);
        const futureEvents = response.data
          .filter((event) => new Date(event.time) >= new Date())
          .sort((a, b) => new Date(b.time) - new Date(a.time));
        setEvents(futureEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events");
      }
    };

    fetchEvents();
  }, []);

  const isInvalidBody = () => {
    const trimmedText = messageBody.trim();
    const containsOnlyHtmlTags = /^(<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>)*$/gm.test(trimmedText);
    return !trimmedText || containsOnlyHtmlTags;
  };

  const isBase64 = (str) => {
    return /^(?:[A-Za-z0-9+/]{4}){1,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // Reset all error states
    setSubjectError("");
    setMessageBodyError("");
    setEmailListError("");
    setEventError("");
    // Check if required fields are empty
    if (!selectedEvent) {
      setEventError("Event selection is required");
      hasError = true;
    }

    if (!emailList.trim()) {
      setEmailListError("Email list is required");
      hasError = true;
    }

    if (!subject.trim()) {
      setSubjectError("Subject is required");
      hasError = true;
    }

    if (!messageBody.trim() || isInvalidBody()) {
      setMessageBodyError("Message body is required");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    const emailArray = emailList
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    const formData = {
      subject,
      messageBody,
      emails: emailArray,
    };

    if (isBase64(formData.messageBody)) {
      const decodedMessageBody = Buffer.from(formData.messageBody, "base64").toString("utf-8");
      console.log("Decoded Message Body:", decodedMessageBody);
      formData.messageBody = decodedMessageBody;
    }

    try {
      const apiUrl = `${BaseURL}/api/volunteer/notify-volunteers`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(apiUrl, formData, { headers });

      if (response.status === 200) {
        toast.success("Notification published successfully");
        setTimeout(() => {
          setSubject("");
          setMessageBody("");
          setMessageBodyError("");
          setEmailList("");
          onClose();
        }, 2000);
      } else {
        const errorMessage = response.data;
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);

    console.log("Selected Event:", eventId);
    // Fetch volunteers' emails for the selected event
    if (eventId) {
      setEventError("");
      try {
        const response = await axios.get(`${BaseURL}/api/volunteer/getVolunteersByEventId/${e.target.value}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
          },
        });
        // Fetch the emails and remove duplicates
        const volunteerEmails = [...new Set(response.data.data.volunteers.map((volunteer) => volunteer.email))].join(
          ", "
        );
        setEmailList(volunteerEmails);
        setEmailListError("");
      } catch (error) {
        console.error("Error fetching volunteer emails:", error);
        toast.error("Failed to fetch emails");
      }
    } else {
      setEmailList("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="notify-volunteers-dialog"
      sx={{ minHeight: "100vh", maxHeight: "80vh" }}
    >
      <DialogTitle>Notify Volunteers</DialogTitle>
      <DialogContent sx={{ minHeight: "40vh" }}>
        <Grid container spacing={1}>
          <Grid item xs={12} mt={1}>
            <FormControl required fullWidth error={!!eventError}>
              <InputLabel id="demo-simple-select-required-label">Event</InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                label="Event *"
                value={selectedEvent}
                onChange={handleChange}
                required
              >
                <MenuItem value="">
                  <em>Select Event</em>
                </MenuItem>
                {events.map((event) => (
                  <MenuItem key={event._id} value={event._id}>
                    {event.name}
                  </MenuItem>
                ))}
              </Select>
              {eventError && <FormHelperText>{eventError}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} mt={1}>
            <TextField
              required
              id="to"
              label="To"
              name="to"
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              fullWidth
              error={!!emailListError}
              helperText={emailListError}
            />
          </Grid>
          <Grid item xs={12} mb={1} mt={1}>
            <TextField
              required
              id="subject"
              label="Subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              error={!!subjectError}
              helperText={subjectError}
            />
          </Grid>
          <Grid item xs={12}>
            <Editor
              value={messageBody}
              onEditorChange={(value) => {
                setMessageBody(value);
              }}
              placeholder="Enter description"
            />
            {messageBodyError && (
              <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                {messageBodyError}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center", mb: 2, p: 0 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#e88a1d", color: "#ffffff", "&:hover": { backgroundColor: "#e88a1d" } }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Publish"}
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ backgroundColor: "#e88a1d", color: "#ffffff", "&:hover": { backgroundColor: "#e88a1d" } }}
        >
          Cancel
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default NotifyVolunteerForm;
