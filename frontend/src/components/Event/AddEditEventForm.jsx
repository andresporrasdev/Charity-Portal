import React, { useState, useEffect } from "react";
import "./Event.css";
import Alert from "@mui/material/Alert";
import axios from "axios";
import BaseURL from "../../config";

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

  useEffect(() => {
    console.log("isFileUploaded:", isFileUploaded);
  }, [isFileUploaded]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateURL = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedFile && !isFileUploaded) {
      setFailMessage("Please click upload button to upload image before submitting the form.");
      return;
    }
    // Validate and update purchaseURL
    const updatedPurchaseURL = validateURL(formData.purchaseURL);

    setFormData((prevFormData) => ({
      ...prevFormData,
      purchaseURL: updatedPurchaseURL,
    }));

    onSave({ ...formData, purchaseURL: updatedPurchaseURL });
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Function to upload the file to the server
  const uploadFile = async () => {
    if (!selectedFile) return;

    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);

    try {
      const response = await axios.post(`${BaseURL}/api/event/upload`, uploadFormData);

      if (response.data.status === "success") {
        setFailMessage("");
        setIsFileUploaded(true);
      } else {
        setFailMessage(response.data.message);
        setIsFileUploaded(false);
      }
      if (response.data.imageUrl) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          imageUrl: response.data.imageUrl,
        }));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFailMessage(error.response.data.message);
      } else {
        setFailMessage("An error occurred while uploading the file.");
      }
      setIsFileUploaded(false);
    }
  };

  return (
    <form className="add-edit-event-form" onSubmit={handleSubmit}>
      <h2>{event ? "Edit Event" : "Add Event"}</h2>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
      </label>
      <label>
        Time:
        <input type="datetime-local" name="time" value={formData.time} onChange={handleChange} required />
      </label>
      <label>
        Place:
        <input type="text" name="place" value={formData.place} onChange={handleChange} required />
      </label>
      <label>
        Price (Public):
        <input type="text" name="pricePublic" value={formData.pricePublic} onChange={handleChange} required />
      </label>
      <label>
        Price (Member):
        <input type="text" name="priceMember" value={formData.priceMember} onChange={handleChange} />
      </label>
      <label>
        Member Only:
        <input type="checkbox" name="isMemberOnly" checked={formData.isMemberOnly} onChange={handleChange} />
      </label>
      <label>
        Image URL:
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
      </label>
      <label>
        Upload Image (Recommended Size: 1080 x 1350 pixels):
        <input type="file" onChange={handleFileChange} />
        {failMessage && selectedFile && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {failMessage}
          </Alert>
        )}
        <button type="button" onClick={uploadFile}>
          Upload
        </button>
      </label>
      <label>
        Purchase URL:
        <input type="text" name="purchaseURL" value={formData.purchaseURL} onChange={handleChange} required />
      </label>
      <div className="form-actions">
        <button type="submit" className="action-button">
          {event ? "Save Changes" : "Add Event"}
        </button>
        <button type="button" className="action-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddEditEventForm;
