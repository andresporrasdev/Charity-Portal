import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseURL from "../../config";
import "react-quill/dist/quill.snow.css";
import Editor from "./Editor";
import axios from "axios";
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
  Typography,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const UpdatePostForm = ({ post, open, onSave, onCancel, roleOptions }) => {
  const [subject, setSubject] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [emailList, setEmailList] = useState("");
  const [loading, setLoading] = useState(false);
  const [newsBodyError, setNewsBodyError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [emailListError, setEmailListError] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    if (post) {
      setSubject(post.subject || "");
      setNewsBody(post.content || "");
      const roles = post.roles ? post.roles.map((role) => role._id) : [];
      setSelectedRoles(roles);
      if (roles.length > 0) {
        handleChange({ target: { value: roles } });
      }
    }
  }, [post]);

  console.log("post:", post);
  console.log("selectedRoles:", selectedRoles);

  const isInvalidBody = () => {
    const trimmedText = newsBody.trim();
    const containsOnlyHtmlTags = /^(<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>)*$/gm.test(trimmedText);
    return !trimmedText || containsOnlyHtmlTags;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // Reset all error states
    setSubjectError("");
    setNewsBodyError("");
    setEmailListError("");

    if (selectedRoles.length > 0 && !emailList.trim()) {
      setEmailListError("Email list is required");
      hasError = true;
    }

    if (!subject.trim()) {
      setSubjectError("Subject is required");
      hasError = true;
    }

    if (!newsBody.trim() || isInvalidBody()) {
      setNewsBodyError("News body is required");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    const id = post._id;
    const apiUrl = `http://localhost:3000/api/post/updatePost/${id}`;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const formData = new FormData();
    formData.append("content", newsBody);
    formData.append("subject", subject);
    formData.append("roles", JSON.stringify(selectedRoles));
    // formData.append("updated", new Date.now());
    console.log("Calling update post form");
    console.log("formData content:", formData.get("content"));
    console.log("formData subject:", formData.get("subject"));
    console.log("formData roles:", formData.get("roles"));

    try {
      const response = await axios.patch(apiUrl, formData, { headers });
      if (response.status === 200) {
        toast.success("News updated successfully");
        const updatedPost = {
          ...post,
          content: newsBody,
          subject: subject,
          roles: selectedRoles.map((roleId) => {
            const role = roleOptions.find((role) => role._id === roleId);
            return role ? { name: role.name, _id: role._id } : { _id: roleId };
          }),
          // updated: new Date.now(),
        };
        onSave(updatedPost);
      } else {
        const errorMessage = response.data;
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const roleIds = e.target.value;
    setSelectedRoles(roleIds);

    if (roleIds.length > 0) {
      try {
        const emailPromises = roleIds.map((roleId) =>
          axios.get(`http://localhost:3000/api/user/getUsersByRoleId/${roleId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        );

        const responses = await Promise.all(emailPromises);
        const memberEmails = responses
          .flatMap((response) => {
            if (response.data && response.data.data && response.data.data.users) {
              return response.data.data.users.map((member) => member.email);
            }
            return [];
          })
          .filter((email, index, self) => self.indexOf(email) === index)
          .join(", ");

        setEmailList(memberEmails);
        setEmailListError("");
      } catch (error) {
        console.error("Error fetching member emails:", error);
        toast.error("Failed to fetch emails");
      }
    } else {
      setEmailList("");
    }
  };

  const handleSendEmail = async () => {
    if (selectedRoles.length > 0) {
      const emailArray = emailList
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "");

      const emailApiUrl = `${BaseURL}/api/post/notify-users`;
      const emailPayload = {
        emails: emailArray,
        subject: subject,
        messageBody: newsBody,
      };

      const emailHeaders = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };

      try {
        const response = await axios.post(emailApiUrl, emailPayload, { headers: emailHeaders });
        if (response.status === 200) {
          toast.success("Emails sent successfully");
        } else {
          toast.error(`Error: ${response.data}`);
        }
      } catch (error) {
        console.error("Error sending emails:", error);
        toast.error("Failed to send emails. Please try again later.");
      }
    } else {
      toast.error("No roles selected. Cannot send emails.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="notify-volunteers-dialog"
      sx={{ minHeight: "100vh", maxHeight: "80vh" }}
    >
      <DialogTitle>Update News</DialogTitle>
      <DialogContent sx={{ minHeight: "40vh" }}>
        <Grid container spacing={1}>
          <Grid item xs={12} mt={1}>
            <FormControl fullWidth>
              {/* error={!!eventError} */}
              <InputLabel id="demo-simple-select-required-label">Roles</InputLabel>
              <Select
                abelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                label="Roles"
                multiple
                value={selectedRoles}
                onChange={handleChange}
                renderValue={(selected) =>
                  selected
                    .map((roleId) => {
                      const role = roleOptions.find((role) => role._id === roleId);
                      return role ? role.name : "";
                    })
                    .join(", ")
                }
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {selectedRoles.length > 0 && (
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
          )}
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
              value={newsBody}
              onEditorChange={(value) => {
                setNewsBody(value);
              }}
              placeholder="Enter description"
            />
            {newsBodyError && (
              <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                {newsBodyError}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between", mb: 2, p: 0 }}>
        <Button variant="contained" color="primary" startIcon={<SendIcon />} onClick={handleSendEmail} sx={{ ml: 3 }}>
          Send Email
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#e88a1d", color: "#ffffff", "&:hover": { backgroundColor: "#e88a1d" } }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
        <Button
          onClick={onCancel}
          variant="contained"
          sx={{ backgroundColor: "#e88a1d", color: "#ffffff", "&:hover": { backgroundColor: "#e88a1d" }, mr: 3 }}
        >
          Cancel
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default UpdatePostForm;
