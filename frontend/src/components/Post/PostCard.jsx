import React, { useState, useRef, useEffect, useContext } from "react";
import "./Post.css";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { ROLES } from "../../UserContext";

const PostCard = ({ post, onEdit, onDelete, onViewDetails, hideActions, user }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { name, time, place, pricePublic, priceMember, isMemberOnly, imageUrl } = post;
  const formattedTime = time.replace("T", " ");
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
      <img src={imageUrl} alt={name} />
      <div className="post-details">
        <h3>{name}</h3>
        <p>{formattedTime}</p>
        <p>{place}</p>
        {isMemberOnly ? (
          <p><strong>Price (Member):</strong> {priceMember}</p>
        ) : (
          <>
            <p><strong>Price (Member):</strong> {priceMember}</p>
            <p><strong>Price (Public):</strong> {pricePublic}</p>
          </>
        )}
      </div>
      {!hideActions && (
        <div className="post-actions">
          <FaEllipsisV onClick={handleMenuToggle} />
          {showMenu && (
            <div className="menu" ref={menuRef}>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
              <button onClick={() => onViewDetails(post)}>View Details</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;