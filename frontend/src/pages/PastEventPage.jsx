import React from 'react';
import { Link } from 'react-router-dom';
import '../components/Event/Event.css';

const PastEventsPage = ({ events }) => {
    const currentDate = new Date();
    const pastEvents = events.filter(event => new Date(event.time) <= currentDate);

    return (
        <div className="past-events-page">
            <h2>All Past Events</h2>
            <ul className="past-events-list">
                {pastEvents.map(event => (
                    <li key={event.id} className="past-event-item">
                        <Link to={`/event/${event.id}`}>{event.name} - {new Date(event.time).toLocaleString()}</Link>
                    </li>
                ))}
            </ul>
            <Link to="/" className="back-link">Back to Events</Link>
        </div>
    );
};

export default PastEventsPage;
