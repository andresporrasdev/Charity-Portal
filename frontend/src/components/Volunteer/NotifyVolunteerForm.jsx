import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import BaseURL from "../../config";

import Editor from "../Post/Editor";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";

const NotifyVolunteerForm = ({ open, onClose }) => {
  const [subject, setSubject] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [newsBodyError, setNewsBodyError] = useState("");
  const [emailList, setEmailList] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/event/readEvent");
        const futureEvents = response.data
          .filter((event) => new Date(event.time) >= new Date())
          .sort((a, b) => new Date(b.time) - new Date(a.time));
        setEvents(futureEvents);

        // if (navigate.state && navigate.state.eventId) {
        //   setFormData((prevFormData) => ({
        //     ...prevFormData,
        //     event: navigate.state.eventId,
        //   }));
        //}
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const isInvalidBody = () => {
    const trimmedText = newsBody.trim();
    const containsOnlyHtmlTags = /^(<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>)*$/gm.test(trimmedText);
    return !trimmedText || containsOnlyHtmlTags;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // if (isInvalidBody()) {
    //   setNewsBodyError("Body Error");
    //   hasError = true;
    // }

    // if (hasError) {
    //   return;
    // }

    // const apiUrl = `http://localhost:3000/api/post/addPost`;
    // // const apiUrl = `${BaseURL}/api/post/addPost`;
    // const headers = {
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    // };

    // const formData = new FormData();

    // formData.append("content", newsBody);
    // formData.append("subject", subject);
    // console.log("formData", formData);
    // console.log("formData", formData.get("content"));
    // console.log("formData", formData.get("subject"));
    // try {
    //   // const response = await axios.post(apiUrl, formData, { headers });
    //   const response = await axios.post(apiUrl, formData);

    //   if (response.status === 200) {
    //     toast.success("Notification published successfully",
    //     //   {
    //     //   position: toast.POSITION.TOP_RIGHT,
    //     //   autoClose: 3000,
    //     // }
    //   );

    //     // setSubject("");
    //     // setNewsBody("");
    //     // setNewsBodyError("");
    //   } else {
    //     const errorMessage = response.data;
    //     toast.error(`Error: ${errorMessage}`,
    //     //   {
    //     //   position: toast.POSITION.TOP_RIGHT,
    //     //   autoClose: 3000,
    //     // }
    //   );
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   toast.error("Failed to publish news. Please try again later.",
    //   //   {
    //   //   position: toast.POSITION.TOP_RIGHT,
    //   //   autoClose: 3000,
    //   // }
    // );
    // }
  };

  const handleChange = async (e) => {
    setSelectedEvent(e.target.value);

    console.log("Selected Event:", e.target.value);
    // Fetch volunteers' emails for the selected event
    if (e.target.value) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/volunteer/getVolunteersByEventId/${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
            },
          }
        );
        // Fetch the emails and remove duplicates
        const volunteerEmails = [...new Set(response.data.data.volunteers.map((volunteer) => volunteer.email))].join(
          ", "
        );
        setEmailList(volunteerEmails);
      } catch (error) {
        console.error("Error fetching volunteer emails:", error);
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
            <FormControl required fullWidth>
              <InputLabel id="demo-simple-select-required-label">Event</InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select"
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
            </FormControl>
            {/* {error && <Alert severity="error">{error}</Alert>} */}
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
            />
          </Grid>
          <Grid item xs={12}>
            <Editor
              value={newsBody}
              onEditorChange={(value) => {
                setNewsBody(value);
              }}
              placeholder="Enter description"
            />
            {newsBodyError && <Alert severity="error">{newsBodyError}</Alert>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Publish
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default NotifyVolunteerForm;
