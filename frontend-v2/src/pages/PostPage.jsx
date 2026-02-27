import React, { useState, useEffect, useContext } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import PostList from "../components/Post/PostList";
import AddPostForm from "../components/Post/AddPostForm";
import UpdatePostForm from "../components/Post/UpdatePostForm";
import axiosInstance from "../utils/axiosInstance";
import { UserContext, ROLES } from "../UserContext";
import ConfirmModal from "../components/ConfirmModal.jsx";

const PostPage = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const fetchPostsForNonMember = async () => {
    const r = await axiosInstance.get("/api/post/getPostsForNonMember");
    return r.data.data.posts;
  };

  const fetchPostsByRole = async () => {
    const r = await axiosInstance.post("/api/post/getPostByRole", { roles: user.roles });
    return r.data.data.posts;
  };

  const fetchRoles = async () => {
    const r = await axiosInstance.get("/api/role/getAllRoles");
    setRoleOptions(r.data.data.roles);
  };

  const fetchAndSetPosts = async () => {
    try {
      const postsData = user ? await fetchPostsByRole() : await fetchPostsForNonMember();
      const sorted = postsData.filter((p) => p.updated).sort((a, b) => new Date(b.updated) - new Date(a.updated));
      setPosts(sorted);
      fetchRoles();
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => { fetchAndSetPosts(); }, [user]);

  const handleSavePost = async (post) => {
    try {
      const response = await axiosInstance.post("/api/post/addPost", post);
      setPosts((prev) => [...prev, response.data.data.post]);
      await fetchAndSetPosts();
      setShowModal(false);
      setCurrentPost(null);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      await axiosInstance.patch(`/api/post/updatePost/${currentPost._id}`, updatedPost);
      setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
      setShowModal(false);
      setCurrentPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const confirmDeletePost = async () => {
    try {
      await axiosInstance.delete(`/api/post/deletePost/${postToDelete}`);
      setPosts((prev) => prev.filter((p) => p._id !== postToDelete));
      setConfirmModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Latest News</Typography>
        {user?.roles.includes(ROLES.ADMIN) && (
          <Button variant="contained" color="primary" onClick={() => { setCurrentPost(null); setShowModal(true); }}>
            + Add News
          </Button>
        )}
      </Box>

      <PostList
        posts={posts}
        onEdit={(post) => { setCurrentPost(post); setShowModal(true); }}
        onDelete={(id) => { setPostToDelete(id); setConfirmModalOpen(true); }}
      />

      {showModal && (
        currentPost ? (
          <UpdatePostForm
            post={currentPost}
            open={showModal}
            onSave={handleUpdatePost}
            onCancel={() => { setShowModal(false); setCurrentPost(null); }}
            roleOptions={roleOptions}
          />
        ) : (
          <AddPostForm
            open={showModal}
            onSave={handleSavePost}
            onCancel={() => { setShowModal(false); setCurrentPost(null); }}
            roleOptions={roleOptions}
          />
        )
      )}

      <ConfirmModal
        title="Confirm Delete"
        text="Are you sure you want to delete this news? Please type 'DELETE' to confirm."
        open={confirmModalOpen}
        onConfirm={confirmDeletePost}
        onClose={() => setConfirmModalOpen(false)}
        confirmWord="DELETE"
      />
    </Container>
  );
};

export default PostPage;
