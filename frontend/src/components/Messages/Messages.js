import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseURL from "../../config";
import { Container, Button, TextField } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import Editor from "./Editor";

const Messages = () => {
  const [subject, setSubject] = useState("");
  const [emailMessageBody, setEmailMessageBody] = useState("");
  const [emailMessageBodyError, setEmailMessageBodyError] = useState("");

  const isInvalidMessage = () => {
    const trimmedText = emailMessageBody.trim();
    const containsOnlyHtmlTags = /^(<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>)*$/gm.test(trimmedText);
    const containsPlaceholders = /{{|}}/.test(trimmedText);
    return !trimmedText || containsOnlyHtmlTags || containsPlaceholders;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (isInvalidMessage()) {
      if (/{{|}}/.test(emailMessageBody)) {
        setEmailMessageBodyError("ReplaceExpressionsError");
      } else {
        setEmailMessageBodyError("EmailMessageBodyError");
      }
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const apiUrl = `${BaseURL}/api/post/`;
    const headers = {
      // "x-subscriber-id": subscriberId,
    };

    const formData = new FormData();

    formData.append("content", emailMessageBody);
    formData.append("subject", subject);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (response.ok) {
        toast.success("Message published successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });

        setSubject("");
        setEmailMessageBody("");
        setEmailMessageBodyError("");
      } else {
        const errorMessage = await response.text();
        toast.error(`Error: ${errorMessage}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to publish message. Please try again later.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
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
      <h3 style={{ margin: "0px 0px 15px 10px" }}>Publish Announcement</h3>
      <form id="message-form" onSubmit={handleSubmit}>
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
          value={emailMessageBody}
          onEditorChange={(value) => {
            setEmailMessageBody(value);
          }}
          placeholder="Enter message"
        />
        {emailMessageBodyError && <p className="error-text">{emailMessageBodyError}</p>}

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: "10px" }}>
          Publish
        </Button>
      </form>
    </Container>
  );
};

export default Messages;
