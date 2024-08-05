import React, { useState, useRef, useEffect, useContext } from "react";
import "./Event.css";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { UserContext, ROLES } from "../../UserContext";
import defaultImageSrc from "../../image/defaultPostPic.png";

const EventCard = ({ event, onEdit, onDelete, onViewDetails, hideActions }) => {
  const { user } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const { name, time, place, pricePublic, priceMember, isMemberOnly, imageUrl } = event;
  const formattedTime = time.replace("T", " ");
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    onEdit(event);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete(event._id);
    setShowMenu(false);
  };

  const handleViewDetails = () => {
    onViewDetails(event);
  };

  const handlePurchaseTicket = () => {
    // console.log("purchaseURL in EventCard", event.purchaseURL);
    if (isMemberOnly && !user?.roles.includes(ROLES.MEMBER)) {
      navigate("/membership");
    } else {
      window.open(event.purchaseURL, "_blank");
    }
  };

  const renderPrice = () => {
    if (isMemberOnly) {
      return (
        <div>
          <p>
            <strong>Price (Member):</strong> {priceMember}
          </p>
          <p> </p>
        </div>
      );
    } else {
      return (
        <div>
          <p>
            <strong>Price (Member):</strong> {priceMember}
          </p>
          <p>
            <strong>Price (Public):</strong> {pricePublic}
          </p>
        </div>
      );
    }
  };

  // Function to handle volunteer click
  const handleVolunteerClick = () => {
    navigate("/volunteer", { state: { eventId: event._id } });
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
    <div className="event-card">
      {isMemberOnly && <div className="member-only-text">Member Only</div>}
      <div className="image-container">
        <img src={imageUrl || defaultImageSrc} alt={name} className="event-image" onClick={handleViewDetails} />
      </div>
      <div className="event-details">
        <h3>{name}</h3>
        <p>
          <strong>Time:</strong> {formattedTime}
        </p>
        <p>
          <strong>Place:</strong> {place}
        </p>
        {renderPrice()}
      </div>

      {!hideActions && (
        <>
          <div className="event-actions">
            <button className="action-button" onClick={handlePurchaseTicket}>
              Purchase Ticket
            </button>
            <button className="action-button" onClick={handleVolunteerClick}>
              Volunteer
            </button>
          </div>

          {user?.roles.includes(ROLES.ADMIN) && (
            <div className="menu-container" onClick={handleMenuToggle} ref={menuRef}>
              <FaEllipsisV className="menu-icon" />
              {showMenu && (
                <div className="dropdown-menu">
                  <button onClick={handleEdit}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventCard;
