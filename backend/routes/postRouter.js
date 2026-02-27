const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/getPostsForNonMember", postController.getPostsWithEmptyRoles);

// addPost is exported as [upload.none(), handler] — auth middleware prepended
router.post(
  "/addPost",
  authController.protect,
  authController.restrict("Administrator", "Organizer"),
  postController.addPost
);

router.patch(
  "/updatePost/:id",
  authController.protect,
  authController.restrict("Administrator", "Organizer"),
  postController.updatePost
);

router.delete(
  "/deletePost/:id",
  authController.protect,
  authController.restrict("Administrator", "Organizer"),
  postController.deletePost
);

router.get("/getPostById/:id", postController.getPostById);

router.post(
  "/getPostByRole",
  authController.protect,
  postController.getPostByRole
);

router.post(
  "/notify-users",
  authController.protect,
  authController.restrict("Administrator", "Organizer"),
  postController.notifyUsersAboutPost
);

module.exports = router;
