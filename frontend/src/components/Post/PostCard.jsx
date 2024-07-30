import React, { useState, useRef } from "react";
import "./Post.css";
import { FaEllipsisV } from "react-icons/fa";
import { ROLES } from "../../UserContext";

const PostCard = ({ post, onEdit, onDelete, user }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { subject, content, updated } = post;
  const formattedTime = new Date(updated).toLocaleString();
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
      <div className="post-details">
        <h3>{subject}</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
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
    </div>
  );
};

export default PostCard;
