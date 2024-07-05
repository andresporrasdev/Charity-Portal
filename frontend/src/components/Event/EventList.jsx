import React from 'react';
import EventCard from './EventCard';
import './Event.css';

const EventList = ({ events, onEdit, onDelete, onViewDetails }) => {
    const sortedEvents = events.sort((a, b) => new Date(a.time) - new Date(b.time));

    return (
        <div className="event-list">
            {sortedEvents.map(event => (
                <EventCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} onViewDetails={onViewDetails}/>
            ))}
        </div>
    );
};

export default EventList;
