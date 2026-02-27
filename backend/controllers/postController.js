const mongoose = require("mongoose");
const postModel = require("../models/postModel");
const path = require("path");
const { sendEmailWithImageAttachment } = require("./../utils/email");
const { uploadNone, uploadDocument, multerErrorHandling } = require("../utils/uploads");
const serverBaseUrl = process.env.SERVER_BASE_URL;

// Insert a post
exports.addPost = [
  uploadNone.none(), // parse multipart/form-data without file
  async (req, res) => {
    const { content, subject, roles = "" } = req.body;

    const rolesArray = roles ? roles.split(",").map((role) => new mongoose.Types.ObjectId(role.trim())) : [];

    const post = new postModel({ content, subject, roles: rolesArray });

    try {
      const savedPost = await post.save();
      res.status(201).json({ status: "success", data: { post: savedPost } });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },
];

// Get all posts with no role restrictions
exports.getPostsWithEmptyRoles = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(0, parseInt(req.query.limit, 10) || 0);
    const skip = limit ? (page - 1) * limit : 0;

    const filter = { roles: { $size: 0 } };
    const [posts, totalResults] = await Promise.all([
      postModel.find(filter).sort({ created: -1 }).skip(skip).limit(limit || undefined),
      postModel.countDocuments(filter),
    ]);

    const totalPages = limit ? Math.ceil(totalResults / limit) : 1;

    res.status(200).json({ status: "success", results: posts.length, totalResults, totalPages, currentPage: page, data: { posts } });
  } catch (error) {
    res.status(500).json({ status: "error", message: "An error occurred while fetching posts." });
  }
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const updateData = req.body;
  updateData.updated = new Date();
  try {
    const updatedPost = await postModel.findByIdAndUpdate(postId, updateData, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ status: "fail", message: "Post not found to update." });
    }
    res.status(200).json({ status: "success", data: { post: updatedPost } });
  } catch (error) {
    res.status(500).json({ status: "error", message: "An error occurred while updating the post." });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const deletedPost = await postModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ status: "fail", message: "Post not found to delete." });
    }
    res.status(200).json({ status: "success", message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: "error", message: "An error occurred while deleting the post." });
  }
};

exports.getPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ status: "fail", message: "Post not found." });
    }
    res.status(200).json({ status: "success", data: { post } });
  } catch (error) {
    res.status(500).json({ status: "error", message: "An error occurred while fetching the post." });
  }
};

exports.getPostByRole = async (req, res) => {
  const roleIds = req.body.roles;
  try {
    const posts = await postModel
      .find({
        $or: [{ roles: { $in: roleIds } }, { roles: { $size: 0 } }],
      })
      .populate("roles");

    if (posts.length === 0) {
      return res.status(404).json({ status: "fail", message: "No posts found for these roles." });
    }
    res.status(200).json({ status: "success", results: posts.length, data: { posts } });
  } catch (error) {
    res.status(500).json({ status: "error", message: "An error occurred while fetching the posts." });
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

// Route to handle document file upload
async function handleDocumentUpload(req, res) {
  try {
    const filename = path.basename(req.file.path);
    const documentUrl = `${serverBaseUrl}/documents/${filename}`;
    res.status(200).json({
      status: "success",
      message: "Document uploaded successfully",
      documentUrl,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

exports.uploadDocuments = uploadDocument;
exports.handleDocumentUpload = handleDocumentUpload;
exports.multerErrorHandling = multerErrorHandling;
