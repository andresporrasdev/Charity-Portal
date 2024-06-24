import React, { useState } from 'react';
import './Event.css';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';

const EventCard = ({ event, onEdit, onDelete, onViewDetails }) => {
    const [showMenu, setShowMenu] = useState(false);
    const { name, description, time, place, pricePublic, priceMember, isMemberOnly, imageUrl } = event;
    const navigate = useNavigate();

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleEdit = () => {
        setShowMenu(false);
        onEdit(event);
    };

    const handleDelete = () => {
        setShowMenu(false);
        onDelete(event.id);
    };

    const handleViewDetails = () => {
        onViewDetails(event);
    };

    const renderPrice = () => {
        if (isMemberOnly) {
            return (
                <div>
                    <p><strong>Price (Member):</strong> {priceMember}</p>
                    <p> </p>
                </div>
            );
        } else {
            return (
                <div>
                    <p><strong>Price (Member):</strong> {priceMember}</p>
                    <p><strong>Price (Public):</strong> {pricePublic}</p> 
                </div>
            );
        }
    };

    return (
        <div className="event-card">
            {isMemberOnly && <div className="member-only-text">Member Only</div>}
            <div className="image-container">
                <img src={imageUrl} alt={name} className="event-image" onClick={handleViewDetails}/>
            </div>
            <div className="event-details">
                <h3>{name}</h3>
                <p><strong>Time:</strong> {time}</p>
                <p><strong>Place:</strong> {place}</p>
                {renderPrice()}
            </div>
            
            <div className="event-actions">
                <button className="action-button" >Purchase Ticket</button>
                <button className="action-button" onClick={() => navigate("/volunteer")}>Volunteer</button>
                <div className="menu-container">
                    <FaEllipsisV onClick={handleMenuToggle} className="menu-icon" />
                    {showMenu && (
                        <div className="dropdown-menu">
                            <button onClick={handleEdit}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
