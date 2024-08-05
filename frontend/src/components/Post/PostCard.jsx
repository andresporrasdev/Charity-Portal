import React, { useState, useRef, useEffect, useContext } from "react";
import "./Post.css";
import { FaEllipsisV, FaTimes } from "react-icons/fa";
import { UserContext, ROLES } from "../../UserContext";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import defaultImageSrc from "../../image/defaultPostPic.png";

const getImageSrcFromContent = (content) => {
  const div = document.createElement("div");
  div.innerHTML = content;
  const img = div.querySelector("img");
  return img ? img.src : null;
};

const extractTextSnippet = (content, length = 100) => {
  const div = document.createElement("div");
  div.innerHTML = content;
  return div.textContent.substring(0, length) + "...";
};

const PostCard = ({ post, onEdit, onDelete }) => {
  const { user } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { subject, content, updated } = post;
  const formattedTime = new Date(updated).toLocaleString();
  const menuRef = useRef(null);
  const imageSrc = getImageSrcFromContent(content);
  const snippet = extractTextSnippet(content, 200);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    onEdit(post);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete(post._id);
    setShowMenu(false);
  };

  const isNewPost = () => {
    const postDate = new Date(post.created);
    const now = new Date();
    const weeksAgo = new Date(now.setDate(now.getDate() - 7));
    return postDate >= weeksAgo;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="post-card">
      <img src={imageSrc || defaultImageSrc} alt="Post Image" />
      <div className="post-details">
        <h3>
          {subject} {isNewPost() && <FiberNewOutlinedIcon color="primary" fontSize="large" />}
        </h3>
        <p>{snippet}</p>
        <a className="more-link" onClick={() => setShowModal(true)}>
          More
        </a>
        <h4>Updated on:</h4>
        <p>{formattedTime}</p>
      </div>
      {user?.roles.includes(ROLES.ADMIN) && (
        <div className="post-actions">
          <FaEllipsisV onClick={handleMenuToggle} />
          {showMenu && (
            <div className="menu" ref={menuRef}>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}
      {showModal && (
        <div className="detail-modal" onClick={() => setShowModal(false)}>
          <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <FaTimes className="close" onClick={() => setShowModal(false)} />
            <h3>{subject}</h3>
            <div dangerouslySetInnerHTML={{ __html: content }} />
            <p>Updated on: {formattedTime}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
