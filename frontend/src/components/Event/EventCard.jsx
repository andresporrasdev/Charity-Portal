import React from 'react';
import './Event.css';
import { FaStar } from 'react-icons/fa';

const EventCard = ({ event }) => {
    const { name, description, time, place, pricePublic, priceMember, isMemberOnly, imageUrl } = event;

    return (
        <div className="event-card">
            {isMemberOnly && <div className="member-only-icon"><FaStar /></div>}
            <img src={imageUrl} alt={name} className="event-image" />
            <div className="event-details">
                <h3>{name}</h3>
                <p>{description}</p>
                <p><strong>Time:</strong> {time}</p>
                <p><strong>Place:</strong> {place}</p>
                <p><strong>Price (Public):</strong> {pricePublic}</p>
                {isMemberOnly && <p><strong>Price (Members Only):</strong> {priceMember}</p>}
                <div className="event-actions">
                    <button className="action-button">Purchase Ticket</button>
                    <button className="action-button">Volunteer</button>
                </div>
            </div>

        </div>
    );
}

export default EventCard;
