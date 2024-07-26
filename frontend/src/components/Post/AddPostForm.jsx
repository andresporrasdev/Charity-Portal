import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseURL from "../../config";
import { Container, Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import Editor from "./Editor";
import axios from "axios";

const AddPostForm = ({ post, onSave, onCancel, roleOptions }) => {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [newsBodyError, setNewsBodyError] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setSubject(post.subject || "");
      setNewsBody(post.content || "");
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

    if (isInvalidBody()) {
      setNewsBodyError("Body Error");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const apiUrl = `${BaseURL}/api/post/addPost`;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const formData = new FormData();
    formData.append("content", newsBody);
    formData.append("subject", subject);
    formData.append("roles", selectedRoles);
    console.log("Roles:", selectedRoles);
    console.log("formData:", formData);

    try {
      const response = await axios.post(apiUrl, formData, { headers });
      if (response.status === 200) {
        toast.success("News published successfully");
      } else {
        const errorMessage = response.data;
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to publish news. Please try again later.");
    }
  };

  return (
    <Container
      style={{
        marginTop: "30px",
        paddingBottom: "50px",
        maxWidth: "650px",
      }}
    >
      <h3 style={{ margin: "0px 0px 15px 10px" }}>Publish News</h3>
      <form id="news-form" onSubmit={handleSubmit}>
        <ToastContainer />
        <TextField
          required
          id="outlined-required"
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
          style={{ marginBottom: "10px" }}
        />
        <Editor
          value={newsBody}
          onEditorChange={(value) => {
            setNewsBody(value);
          }}
          placeholder="Enter description"
        />
        {newsBodyError && <p className="error-text">{newsBodyError}</p>}

        <FormControl fullWidth style={{ marginTop: "10px" }}>
          <InputLabel id="roles-label">Roles</InputLabel>
          <Select
            labelId="roles-label"
            id="roles"
            multiple
            value={selectedRoles}
            onChange={(e) => setSelectedRoles(e.target.value)}
            renderValue={(selected) => selected.map(roleId => {
              const role = roleOptions.find(role => role._id === roleId);
              return role ? role.name : '';
            }).join(", ")}
          >
            {roleOptions.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: "10px" }}>
          Publish
        </Button>
      </form>
    </Container>
  );
};

export default AddPostForm;