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

  const isInvalidBody = () => {
    const trimmedText = newsBody.trim();
    const containsOnlyHtmlTags = /^(<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>)*$/gm.test(trimmedText);
    return !trimmedText || containsOnlyHtmlTags;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    setSubjectError(""); setNewsBodyError(""); setEmailListError("");

    if (selectedRoles.length > 0 && !emailList.trim()) { setEmailListError("Email list is required"); hasError = true; }
    if (!subject.trim()) { setSubjectError("Subject is required"); hasError = true; }
    if (!newsBody.trim() || isInvalidBody()) { setNewsBodyError("News body is required"); hasError = true; }
    if (hasError) return;

    const formData = new FormData();
    formData.append("content", newsBody);
    formData.append("subject", subject);
    formData.append("roles", JSON.stringify(selectedRoles));

    try {
      const response = await axiosInstance.patch(`/api/post/updatePost/${post._id}`, formData);
      if (response.status === 200) {
        toast.success("News updated successfully");
        const updatedPost = {
          ...post,
          content: newsBody,
          subject,
          roles: selectedRoles.map((roleId) => {
            const role = roleOptions.find((r) => r._id === roleId);
            return role ? { name: role.name, _id: role._id } : { _id: roleId };
          }),
        };
        onSave(updatedPost);
      } else {
        toast.error(`Error: ${response.data}`);
      }
    } catch {
      toast.error("Failed to update news. Please try again later.");
    }
  };

  const handleChange = async (e) => {
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

  const handleSendEmail = async () => {
    setLoading(true);
    if (selectedRoles.length > 0) {
      const emailArray = emailList.split(",").map((e) => e.trim()).filter(Boolean);
      try {
        const response = await axiosInstance.post(
          "/api/post/notify-users",
          { emails: emailArray, subject, messageBody: newsBody }
        );
        if (response.status === 200) toast.success("Emails sent successfully");
        else toast.error(`Error: ${response.data}`);
      } catch {
        toast.error("Failed to send emails. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("No roles selected. Cannot send emails.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} sx={{ minHeight: "100vh", maxHeight: "80vh" }}>
      <DialogTitle>Edit News</DialogTitle>
      <DialogContent sx={{ minHeight: "40vh" }}>
        <Grid container spacing={1}>
          <Grid item xs={12} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Roles</InputLabel>
              <Select label="Roles" multiple value={selectedRoles} onChange={handleChange}
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
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between", mb: 2, p: 0, mt: 2 }}>
        <Button variant="contained" color="primary" startIcon={<SendIcon />} onClick={handleSendEmail} disabled={loading} sx={{ ml: 3 }}>
          {loading ? <CircularProgress size={24} /> : "Send Email"}
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
        <Button onClick={onCancel} variant="contained" color="primary" sx={{ mr: 3 }}>Cancel</Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default UpdatePostForm;
