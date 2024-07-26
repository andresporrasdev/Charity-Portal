import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseURL from "../../config";
import { Container, Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import Editor from "./Editor";
import axios from "axios";

const UpdatePostForm = ({ post, onSave, onCancel, roleOptions }) => {
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
      setSelectedRoles(Array.isArray(post.roles) ? post.roles : []);
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
  
    const id = post._id;
    const apiUrl = `http://localhost:3000/api/post/updatePost/${id}`;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
  
    const formData = new FormData();
    formData.append("content", newsBody);
    formData.append("subject", subject);
    formData.append("roles", selectedRoles);
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
          roles: selectedRoles,
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
      <h3 style={{ margin: "0px 0px 15px 10px" }}>Update News</h3>
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
          Update
        </Button>
      </form>
    </Container>
  );
};

export default UpdatePostForm;