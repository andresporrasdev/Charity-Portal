import React from 'react';
import EventCard from './EventCard';
import './Event.css';

const EventList = ({ events, onEdit, onDelete, onViewDetails }) => {
    return (
        <div className="event-list">
            {events.map(event => (
                <EventCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} onViewDetails={onViewDetails}/>
            ))}
        </div>
    );
};

export default EventList;
