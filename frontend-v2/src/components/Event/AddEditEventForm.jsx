import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Box,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

const AddEditEventForm = ({ event, onSave, onCancel }) => {
  const [failMessage, setFailMessage] = useState("");
  const [formData, setFormData] = useState(
    event || {
      name: "",
      description: "",
      time: "",
      place: "",
      pricePublic: "",
      priceMember: "",
      isMemberOnly: false,
      imageUrl: "",
      purchaseURL: "",
    }
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const validateURL = (url) => {
    if (!/^https?:\/\//i.test(url)) return `http://${url}`;
    return url;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && !isFileUploaded) {
      setFailMessage("Please click Upload to upload image before submitting.");
      return;
    }
    const updatedPurchaseURL = validateURL(formData.purchaseURL);
    onSave({ ...formData, purchaseURL: updatedPurchaseURL });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);
    try {
      const response = await axiosInstance.post("/api/event/upload", uploadFormData);
      if (response.data.status === "success") {
        setFailMessage("");
        setIsFileUploaded(true);
      } else {
        setFailMessage(response.data.message);
        setIsFileUploaded(false);
      }
      if (response.data.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
      }
    } catch (error) {
      setFailMessage(error.response?.data?.message || "An error occurred while uploading the file.");
      setIsFileUploaded(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">{event ? "Edit Event" : "Add Event"}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} required fullWidth multiline rows={3} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Time" name="time" type="datetime-local" value={formData.time} onChange={handleChange} required fullWidth InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Place" name="place" value={formData.place} onChange={handleChange} required fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Price (Public)" name="pricePublic" value={formData.pricePublic} onChange={handleChange} required fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Price (Member)" name="priceMember" value={formData.priceMember} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox name="isMemberOnly" checked={formData.isMemberOnly} onChange={handleChange} color="primary" />}
            label="Member Only"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>Upload Image (Recommended: 1080×1350px)</Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button variant="outlined" component="label" size="small">
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {selectedFile && <Typography variant="caption">{selectedFile.name}</Typography>}
            <Button variant="contained" size="small" onClick={uploadFile} disabled={!selectedFile || uploading}>
              {uploading ? <CircularProgress size={20} /> : "Upload"}
            </Button>
          </Box>
          {failMessage && selectedFile && <Alert severity="error" sx={{ mt: 1 }}>{failMessage}</Alert>}
        </Grid>
        <Grid item xs={12}>
          <TextField label="Purchase URL" name="purchaseURL" value={formData.purchaseURL} onChange={handleChange} required fullWidth />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" type="submit">
          {event ? "Save Changes" : "Add Event"}
        </Button>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default AddEditEventForm;
