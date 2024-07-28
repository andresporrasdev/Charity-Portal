import React, { useState, useEffect, useContext } from "react";
import PostList from "../components/Post/PostList";
import AddPostForm from "../components/Post/AddPostForm";
import UpdatePostForm from "../components/Post/UpdatePostForm";
// import { fetchPosts } from "../components/Post/FetchPost";
import "../components/Post/Post.css";
import axios from "axios";
import { UserContext } from "../UserContext";
import BaseURL from "../config";

const PostPage = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  // console.log("users", user.roles);

  const fetchAndSetPosts = async () => {
    //let postsData;
    // if (user) {
    //   postsData = await fetchPostsbyRole();
    // } else {
    //   postsData = await fetchPosts();
    // }
    const postsData = user ? await fetchPostsbyRole() : await fetchPosts();
    //  const postsData = await fetchPosts();
    // console.log("postsData", postsData);
    setPosts(postsData);
    fetchRoles();
  };

  useEffect(() => {
    fetchAndSetPosts();
  }, [user]);

  // Retrive all the posts from the database
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/post/readPost");
      console.log("Posts:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  //Retrive post only for the user role
  const fetchPostsbyRole = async () => {
    try {
      const response = await axios.post(`${BaseURL}/api/post/getPostByRole`, { roles: user.roles });
      console.log("Posts:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const fetchRoles = async () => {
    // console.log("fetchRoles function called");
    try {
      const response = await axios.get(`${BaseURL}/api/role/getAllRoles`);
      // console.log("Roles fetched successfully:", response.data);
      setRoleOptions(response.data.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

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
      fetchAndSetPosts(); // Post를 추가한 후 게시물 목록을 다시 가져옴
      handleCloseModal();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      const updateUrl = `http://localhost:3000/api/post/updatePost/${currentPost._id}`;
      console.log("updateUrl", updateUrl);
      console.log("post", updatedPost);
      await axios.patch(updateUrl, updatedPost);
      setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
      handleCloseModal();
      console.log("post updated", updatedPost);
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
          onEdit={handleEditPost}
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
            {currentPost ? (
              <UpdatePostForm
                post={currentPost}
                open={handleEditPost}
                onSave={handleUpdatePost}
                onCancel={handleCloseModal}
                roleOptions={roleOptions}
              />
            ) : (
              <AddPostForm
                open={handleAddPost}
                onSave={handleSavePost}
                onCancel={handleCloseModal}
                roleOptions={roleOptions}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
