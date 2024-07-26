import React, { useState, useRef } from "react";
import "./Post.css";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";

const PostCard = ({ post, onEdit, onDelete, onViewDetails, hideActions, user }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { subject, content, imageUrl, updated } = post;
  const formattedTime = new Date(updated).toLocaleString();
  const navigate = useNavigate();
  const menuRef = useRef(null);

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

  return (
    <div className="post-card">
      {/* <img src={imageUrl} alt={subject} /> */}
      <div className="post-details">
        <h3>{subject}</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <h4>Updated on:</h4>
        <p>{formattedTime}</p>
      </div>
      {!hideActions && (
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
    </div>
  );
};

export default PostCard;