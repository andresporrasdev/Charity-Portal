import React, { useState, useEffect, useContext } from "react";
import PostList from "../components/Post/PostList";
import AddPostForm from "../components/Post/AddPostForm";
import UpdatePostForm from "../components/Post/UpdatePostForm";
import { fetchPosts } from "../components/Post/FetchPost";
import "../components/Post/Post.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

const PostPage = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      const postsData = await fetchPosts();
      console.log("postsData", postsData);
      setPosts(postsData);
    };

    fetchAndSetPosts();
  }, []);

  const handleAddPost = () => {
    setCurrentPost(null);
    setShowModal(true);
  };

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPost(null);
  };

  const handleSavePost = async (post) => {
    try {
      const response = await axios.post("http://localhost:3000/api/post/addPost", post);
      setPosts([...posts, response.data]);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleUpdatePost = async (post) => {
    try {
      const updateUrl = `http://localhost:3000/api/post/updatePost/${currentPost._id}`;
      console.log("updateUrl", updateUrl);
      console.log("post", post);
      await axios.patch(updateUrl, post);
      setPosts(posts.map((p) => (p._id === post._id ? post : p)));
      console.log("post updated", post);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/post/deletePost/${id}`);
      console.log("post deleted", id);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const currentDate = new Date();
  const upcomingPosts = posts
    .filter((post) => post.updated) // Ensure the post has an updated field
    .sort((a, b) => new Date(b.updated) - new Date(a.updated)); // Sort by updated field in descending order

  return (
    <div className="post-page">
      {user?.roles.includes("66678417525bc55cbcd28a96") && (
        <button className="add-post-button" onClick={handleAddPost}>
          Add Post
        </button>
      )}
      <section>
        <h2>Lastest News</h2>
        <PostList
          posts={upcomingPosts.map((post) => ({ ...post }))}
          onEdit={handleEditPost} // Change this line
          onDelete={handleDeletePost}
          user={user}
        />
      </section>
      {showModal && (
        <div className="add_edit_post_modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <UpdatePostForm post={currentPost} onSave={handleUpdatePost} onCancel={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;