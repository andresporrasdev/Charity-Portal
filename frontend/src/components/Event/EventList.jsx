import React from 'react';
import EventCard from './EventCard';
import './Event.css'; 

const EventList = ({ events }) => {
    // Sort events by time (assuming time is a valid Date string)
    const sortedEvents = events.sort((a, b) => new Date(a.time) - new Date(b.time));

    return (
        <div className="event-list">
            {sortedEvents.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
}

export default EventList;

