const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.get("/readPost", postController.getAllPosts);
router.post("/addPost", postController.addPost);
router.patch("/updatePost/:id", postController.updatePost);
router.delete("/deletePost/:id", postController.deletePost);
router.get("/getPostById/:id", postController.getPostById);
router.get("/getPostByRole/:role", postController.getPostByRole);
router.post(
  "/uploadImage",
  postController.upload.single("file"),
  postController.multerErrorHandling,
  postController.handleFileUpload
); //For upload images in form post

router.post(
    "/uploadFile",
    postController.upload.single("file"),
    postController.multerErrorHandling,
    postController.handleDocumentUpload

  ); //For upload images in form post

module.exports = router;