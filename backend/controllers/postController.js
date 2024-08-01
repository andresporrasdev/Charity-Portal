const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const postModel = require("../models/postModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { sendEmailWithImageAttachment } = require("./../utils/email");
const config = require("../config"); // Import the config file


//CRUD methods for post

// Set up storage for uploaded files
const storage = multer.memoryStorage(); // Use memory storage for simplicity

const upload = multer({ storage: storage });

// Insert a post
exports.addPost = [
  upload.none(), // Use multer to parse form-data without file uploads
  async (req, res) => {
    const { content, subject, roles = "" } = req.body;
    console.log("content:", content);
    console.log("subject:", subject);
    //   console.log('roles:', roles);

    // Convert roles from string to array of ObjectId
    const rolesArray = roles ? roles.split(",").map((role) => mongoose.Types.ObjectId(role.trim())) : [];

    const post = new postModel({ content, subject, roles: rolesArray });

    try {
      const savedPost = await post.save();
      console.log("Post saved successfully", savedPost);
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
];

//Get all post
exports.getPostsWithEmptyRoles = async (req, res) => {
  try {
    // Find posts where roles is null
    const posts = await postModel.find({ roles: { $size: 0 } });
    res.status(200).json(posts);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "An error occurred while fetching posts." });
  }
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const updateData = req.body;
  // Add current date to the updated field
  updateData.updated = new Date();
  // console.log('updateData:', updateData);
  try {
    const updatedPost = await postModel.findByIdAndUpdate(postId, updateData, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found to update." });
    }
    res.status(200).json(updatedPost);
    console.log("Post updated successfully", updatedPost);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the post." });
  }
};

//Delete a post

exports.deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const deletedPost = await postModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found to delete." });
    }
    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting the post." });
  }
};

//Get post by ID

exports.getPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the post." });
  }
};

// Method to get posts filtered by role
// Method to get posts filtered by role
exports.getPostByRole = async (req, res) => {
  const roleIds = req.body.roles; // Expecting an array of ObjectIDs in the request body
  try {
    // Find posts that contain any of the roles in the array or where roles is null
    const posts = await postModel
      .find({
        $or: [{ roles: { $in: roleIds } }, { roles: { $size: 0 } }],
      })
      .populate("roles");

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for these roles." });
    }
    res.status(200).json(posts);
    console.log("Posts fetching by Roles:", posts);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the posts." });
  }
};

exports.notifyUsersAboutPost = async (req, res) => {
  try {
    await sendEmailWithImageAttachment(req, res);
  } catch (error) {
    console.error("Error notifying users:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to notify users.",
    });
  }
};

//Upload image for post
//Directory for post file upload
const uploadDirImages = "public/images/events"; // Adjusted to use the public directory

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadDirImages)) {
  fs.mkdirSync(uploadDirImages, { recursive: true });
}

// // Set up storage for uploaded files
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, uploadDirImages); // Use the uploads directory
//     },
//     filename: function (req, file, cb) {
//       cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname); //Create a unique filename
//     },
//   });

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

//   // Set up the multer object for filtering file size
// const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5, // 5MB max file size
//     },
//     fileFilter: fileFilter,
//   });

// Route to handle file upload
async function handleFileUpload(req, res) {
  try {
    // Extract filename from the uploaded file path
    const filename = path.basename(req.file.path);

    // Construct the new URL
    const imageUrl = `${config.baseURL}/images/${filename}`;
    
    // Use the new imageUrl in the response
    res.status(200).json({
      status: "success",
      message: "File uploaded successfully",
      imageUrl: imageUrl, // Updated to use the new URL
    });
    console.log("Image uploaded successfully");
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
    console.log("Error uploading image");
  }
}

// Multer error handling middleware
exports.multerErrorHandling = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ status: "fail", message: "File size exceeds limit. Max 5MB allowed." });
  } else {
    next(err);
  }
};

const uploadDirFiles = "public/files/posts"; // Adjusted to use the public directory

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadDirFiles)) {
  fs.mkdirSync(uploadDirFiles, { recursive: true });
}

// Set up storage for uploaded documents
const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDocDir); // Use the document uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname); // Create a unique filename
  },
});

// Define a new file filter for documents
const documentFileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Not a document! Please upload only PDF, DOC, or DOCX files."), false);
  }
};

// Set up multer for document uploads
const uploadDocuments = multer({
  storage: documentStorage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB max file size
  },
  fileFilter: documentFileFilter,
});

// New handleFileUpload function for documents
async function handleDocumentUpload(req, res) {
  try {
    const filename = path.basename(req.file.path);
    
    const documentUrl = `${config.baseURL}/documents/${filename}`;
    res.status(200).json({
      status: "success",
      message: "Document uploaded successfully",
      documentUrl: documentUrl,
    });
    console.log("Document uploaded successfully");
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
    console.log("Error uploading document");
  }
}

exports.handleFileUpload = handleFileUpload;
exports.uploadDocuments = uploadDocuments;
exports.handleDocumentUpload = handleDocumentUpload;
exports.upload = upload;
