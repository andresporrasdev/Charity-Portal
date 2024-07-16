import React, { useState, useEffect } from 'react';
import EventList from '../components/Event/EventList';
import { fetchEvents } from '../components/Event/FetchEvent';
import '../components/Event/Event.css';

const PastEventPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchAndSetEvents = async () => {
            const eventsData = await fetchEvents();
            const pastEvents = eventsData.filter(event => new Date(event.time) <= new Date())
                .sort((a, b) => new Date(b.time) - new Date(a.time));
            setEvents(pastEvents);
            setFilteredEvents(pastEvents);
        };

        fetchAndSetEvents();
    }, []);

    const handleStartDateChange = (e) => {
        const value = e.target.value;
        setStartDate(value);
        filterEvents(value, endDate);
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;
        setEndDate(value);
        filterEvents(startDate, value);
    };

    const filterEvents = (startDate, endDate) => {
        let filtered = events;

        if (startDate) {
            filtered = filtered.filter(event => new Date(event.time) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(event => new Date(event.time) <= new Date(endDate));
        }

        setFilteredEvents([...filtered]);
    };

    return (
        <div className="past-event-page">
            <h2>Past Events</h2>
            <div className="filter-section">
                <div className="date-filter">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </div>
            </div>
            <EventList
                events={filteredEvents.map(event => ({ ...event, time: event.time.toString() }))}
                onViewDetails={(event) => console.log('View details for event:', event)}
                hideActions={true}
            />
        </div>
    );
};

export default PastEventPage;
