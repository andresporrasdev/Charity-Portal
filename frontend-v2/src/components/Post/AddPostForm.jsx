import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import Editor from "../Editor/Editor";
import axiosInstance from "../../utils/axiosInstance";
import {
  TextField,
  Grid,
  Button,
  MenuItem,
  Select,
  Alert,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Box,
} from "@mui/material";

// When used as a standalone page (route /add-news), standalone=true
const AddPostForm = ({ open, onSave, onCancel, roleOptions: propRoleOptions, standalone }) => {
  const [subject, setSubject] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [emailList, setEmailList] = useState("");
  const [loading, setLoading] = useState(false);
  const [newsBodyError, setNewsBodyError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [emailListError, setEmailListError] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roleOptions, setRoleOptions] = useState(propRoleOptions || []);

  useEffect(() => {
    if (standalone) {
      axiosInstance
        .get("/api/role/getAllRoles")
        .then((res) => setRoleOptions(res.data.data.roles))
        .catch(() => {});
    }
  }, [standalone]);

  const isInvalidBody = () => {
    const trimmedText = newsBody.trim();
    const containsOnlyHtmlTags = /^(<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>)*$/gm.test(trimmedText);
    return !trimmedText || containsOnlyHtmlTags;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    setSubjectError("");
    setNewsBodyError("");
    setEmailListError("");

    if (selectedRoles.length > 0 && !emailList.trim()) {
      setEmailListError("Email list is required");
      hasError = true;
    }
    if (!subject.trim()) { setSubjectError("Subject is required"); hasError = true; }
    if (!newsBody.trim() || isInvalidBody()) { setNewsBodyError("News body is required"); hasError = true; }
    if (hasError) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("content", newsBody);
    formData.append("subject", subject);
    formData.append("roles", selectedRoles);

    try {
      if (selectedRoles.length > 0) {
        const emailArray = emailList.split(",").map((e) => e.trim()).filter(Boolean);
        const emailResponse = await axiosInstance.post(
          "/api/post/notify-users",
          { emails: emailArray, subject, messageBody: newsBody }
        );
        if (emailResponse.status === 200) {
          toast.success("Email sent successfully");
          if (onSave) await onSave(formData);
          else await axiosInstance.post("/api/post/addPost", formData);
          toast.success("News published!");
        } else {
          toast.error("Failed to send email");
        }
      } else {
        if (onSave) await onSave(formData);
        else await axiosInstance.post("/api/post/addPost", formData);
        toast.success("News published!");
      }
    } catch {
      toast.error("Failed to publish news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (e) => {
    const roleIds = e.target.value;
    setSelectedRoles(roleIds);
    if (roleIds.length > 0) {
      try {
        const responses = await Promise.all(
          roleIds.map((roleId) => axiosInstance.get(`/api/user/getUsersByRoleId/${roleId}`))
        );
        const emails = responses
          .flatMap((r) => r.data?.data?.users?.map((m) => m.email) || [])
          .filter((email, i, self) => self.indexOf(email) === i)
          .join(", ");
        setEmailList(emails);
        setEmailListError("");
      } catch {
        toast.error("Failed to fetch emails");
      }
    } else {
      setEmailList("");
    }
  };

  const formContent = (
    <Grid container spacing={1}>
      <Grid item xs={12} mt={1}>
        <Alert severity="info">
          Select roles to notify. If none selected, news will be public and not emailed.
        </Alert>
      </Grid>
      <Grid item xs={12} mt={1}>
        <FormControl fullWidth>
          <InputLabel>Roles</InputLabel>
          <Select label="Roles" multiple value={selectedRoles} onChange={handleRoleChange}
            renderValue={(selected) =>
              selected.map((id) => roleOptions.find((r) => r._id === id)?.name || "").join(", ")
            }
          >
            {roleOptions.map((role) => (
              <MenuItem key={role._id} value={role._id}>{role.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {selectedRoles.length > 0 && (
        <Grid item xs={12} mt={1}>
          <TextField required id="to" label="To" value={emailList}
            onChange={(e) => setEmailList(e.target.value)} fullWidth
            error={!!emailListError} helperText={emailListError} />
        </Grid>
      )}
      <Grid item xs={12} mb={1} mt={1}>
        <TextField required id="subject" label="Subject" value={subject}
          onChange={(e) => setSubject(e.target.value)} fullWidth
          error={!!subjectError} helperText={subjectError} />
      </Grid>
      <Grid item xs={12}>
        <Editor value={newsBody} onEditorChange={(v) => setNewsBody(v)} placeholder="Enter description" />
        {newsBodyError && <Typography color="error" variant="caption" sx={{ ml: 1 }}>{newsBodyError}</Typography>}
      </Grid>
    </Grid>
  );

  if (standalone) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>Add News</Typography>
          {formContent}
          <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Send & Save"}
            </Button>
          </Box>
        </Paper>
        <ToastContainer />
      </Container>
    );
  }

  return (
    <Dialog open={open} onClose={onCancel} sx={{ minHeight: "100vh", maxHeight: "80vh" }}>
      <DialogTitle>Add News</DialogTitle>
      <DialogContent sx={{ minHeight: "40vh" }}>{formContent}</DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center", mb: 2, p: 0, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Send & Save"}
        </Button>
        <Button onClick={onCancel} variant="contained" color="primary">Cancel</Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default AddPostForm;
