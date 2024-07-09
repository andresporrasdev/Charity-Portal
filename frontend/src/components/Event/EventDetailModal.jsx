import React from 'react';
import './Event.css';
import { useNavigate } from 'react-router-dom';

const EventDetailsModal = ({ event, onClose }) => {

    const navigate = useNavigate();
    
    return (
        <div className="event_detail_modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
                <div className="event-details-modal">
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <p><strong>Time:</strong> {event.time}</p>
                    <p><strong>Place:</strong> {event.place}</p>
                    <p><strong>Price (Member):</strong> {event.priceMember}</p>
                    {!event.isMemberOnly && (
                        <p><strong>Price (Public):</strong> {event.pricePublic}</p>
                    )}
                    <button className="action-button">Purchase Ticket</button>
                    <button className="action-button" onClick={() => navigate("/volunteer")}>Volunteer</button>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
