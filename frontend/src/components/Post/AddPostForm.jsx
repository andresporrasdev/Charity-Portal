import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseURL from "../../config";
import { Container, Button, TextField } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import Editor from "./Editor";
import axios from "axios";

const AddPostForm = ({ post, onSave, onCancel }) => {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [newsBodyError, setNewsBodyError] = useState("");

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

    const apiUrl = `http://localhost:3000/api/post/addPost`;
    // const apiUrl = `${BaseURL}/api/post/addPost`;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const formData = new FormData();

    formData.append("content", newsBody);
    formData.append("subject", subject);
    console.log("formData", formData);
    console.log("formData", formData.get("content"));
    console.log("formData", formData.get("subject"));
    console.log("Calling add post form");
    try {
      // const response = await axios.post(apiUrl, formData, { headers });
      const response = await axios.post(apiUrl, formData);


      if (response.status === 200) {
        toast.success("News published successfully",
        //   {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 3000,
        // }
      );

        // setSubject("");
        // setNewsBody("");
        // setNewsBodyError("");
      } else {
        const errorMessage = response.data;
        toast.error(`Error: ${errorMessage}`,
        //   {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 3000,
        // }
      );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to publish news. Please try again later.",
      //   {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 3000,
      // }
    );
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
          //error={!!subjectError}
          // helperText={subjectError}
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

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: "10px" }}>
          Publish
        </Button>
      </form>
    </Container>
  );
};

export default AddPostForm;
