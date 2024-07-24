import React from 'react';
import EventCard from './EventCard';
import './Event.css';

const EventList = ({ events, onEdit, onDelete, onViewDetails, hideActions, user }) => {
    return (
        <div className="event-list">
            {events.map(event => (
                <EventCard
                    key={event._id}
                    event={event}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewDetails={onViewDetails}
                    hideActions={hideActions}
                    user={user}
                />
            ))}
        </div>
    );
};

export default EventList;
