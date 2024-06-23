import React, { useState } from 'react';
import EventList from '../components/Event/EventList';
import '../components/Event/Event.css';

const Event = () => {
    // Example initial events (can be fetched from an API or stored locally)
    const [events, setEvents] = useState([
        {
            id: 1,
            name: "Summer Gathering",
            description: "Join us for a day of fun in the sun!",
            time: "2024-07-15 10:00 AM", // String representation of date and time
            place: "Central Park",
            pricePublic: "$20",
            priceMember: "$15",
            isMemberOnly: false,
            imageUrl: "/image/EventImage/event1.png"
        },
        {
            id: 2,
            name: "Annual Members Gala",
            description: "An exclusive evening for our esteemed members.",
            time: "2024-08-20 07:00 PM", // String representation of date and time
            place: "Grand Hotel",
            pricePublic: "$50",
            priceMember: "$40",
            isMemberOnly: true,
            imageUrl: "/image/EventImage/event2.png"
        }
    ]);

    // Filter events into upcoming and past
    const currentDate = new Date();
    const upcomingEvents = events.filter(event => new Date(event.time) > currentDate);
    const pastEvents = events.filter(event => new Date(event.time) <= currentDate);

    return (
        <div className="event-page">
            <h1>Events</h1>
            <section>
                <h2>Upcoming Events</h2>
                <EventList events={upcomingEvents.map(event => ({ ...event, time: event.time.toString() }))} />
            </section>
            <section>
                <h2>Past Events</h2>
                <EventList events={pastEvents.map(event => ({ ...event, time: event.time.toString() }))} />
            </section>
        </div>
    );
}

export default Event;
