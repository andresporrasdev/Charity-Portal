import React, { useState, useEffect, useContext } from "react";
import PostList from "../components/Post/PostList";
import AddPostForm from "../components/Post/AddPostForm";
import { fetchPosts } from "../components/Post/FetchPost";
import "../components/Post/Post.css";
import { Link } from "react-router-dom";
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
      if (currentPost && currentPost._id) {
        const updateUrl = `http://localhost:3000/api/post/updatePost/${currentPost._id}`;
        await axios.patch(updateUrl, post);
        setPosts(posts.map((p) => (p._id === post._id ? post : p)));
      } else {
        const response = await axios.post("http://localhost:3000/api/post/addPost", post);
        setPosts([...posts, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/post/deletePost/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const currentDate = new Date();
  // const upcomingPosts = posts
  //   .filter((post) => new Date(post.time) > currentDate)
  //   .sort((a, b) => new Date(a.time) - new Date(b.time));
  // const upcomingPosts = posts.sort((a, b) => new Date(a.time) - new Date(b.time));
  const upcomingPosts = posts
  console.log("upcomingPosts", upcomingPosts);

  // const pastPosts = posts
  //   .filter((post) => new Date(post.time) <= currentDate)
  //   .sort((a, b) => new Date(b.time) - new Date(a.time))
  //   .slice(0, 3);

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
          posts={upcomingPosts.map((post) => ({ ...post,}))}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          user={user}
        />
      </section>
      {/* <section className="past-posts-section">
        <h2>Past Posts</h2>
        <PostList
          posts={pastPosts.map((post) => ({ ...post, time: post.time.toString() }))}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          hideActions={true}
          user={user}
        />
        <Link to="/past-posts" className="more-link">
          See All Past Posts
        </Link>
      </section> */}

      {showModal && (
        <div className="add_edit_post_modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <AddPostForm post={currentPost} onSave={handleSavePost} onCancel={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;