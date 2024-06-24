import React, { useState } from 'react';
import EventList from '../components/Event/EventList';
import AddEditEventForm from '../components/Event/AddEditEventForm';
import EventDetailModal from '../components/Event/EventDetailModal';
import '../components/Event/Event.css';
import { Link } from 'react-router-dom';


const EventPage = () => {
    const [events, setEvents] = useState([
        {
            id: 1,
            name: "Summer Gathering",
            description: "Join us for a day of fun in the sun!",
            time: "2024-07-15 10:00 AM",
            place: "Central Park",
            pricePublic: "$20/Family, $15/Couple",
            priceMember: "$15",
            isMemberOnly: false,
            imageUrl: "/image/EventImage/event1.png"
        },
        {
            id: 2,
            name: "Annual Members Gala",
            description: "An exclusive evening for our esteemed members. An exclusive evening for our esteemed members. An exclusive evening for our esteemed members.",
            time: "2024-08-20 07:00 PM",
            place: "Grand Hotel",
            pricePublic: "$50",
            priceMember: "$40",
            isMemberOnly: true,
            imageUrl: "/image/EventImage/event2.jpg"
        },
        {
            id: 3,
            name: "Members Meeting",
            description: "An exclusive evening for our esteemed members.",
            time: "2024-07-20 07:00 PM",
            place: "Grand Hotel",
            pricePublic: "$50",
            priceMember: "$40",
            isMemberOnly: true,
            imageUrl: "/image/EventImage/event2.jpg"
        },
        {
            id: 4,
            name: "Members Meeting",
            description: "An exclusive evening for our esteemed members.",
            time: "2024-07-20 07:00 PM",
            place: "Grand Hotel",
            pricePublic: "$50",
            priceMember: "$40",
            isMemberOnly: true,
            imageUrl: "/image/EventImage/event2.jpg"
        },
        {
            id: 5,
            name: "Members Meeting",
            description: "An exclusive evening for our esteemed members.",
            time: "2023-07-20 07:00 PM",
            place: "Grand Hotel",
            pricePublic: "$50",
            priceMember: "$40",
            isMemberOnly: true,
            imageUrl: "/image/EventImage/event2.jpg"
        } ,
        {
            id: 6,
            name: "Members Meeting",
            description: "An exclusive evening for our esteemed members.",
            time: "2023-08-20 07:00 PM",
            place: "Grand Hotel",
            pricePublic: "$50",
            priceMember: "$40",
            isMemberOnly: true,
            imageUrl: "/image/EventImage/event2.jpg"
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const handleAddEvent = () => {
        setCurrentEvent(null);
        setShowModal(true);
    };

    const handleEditEvent = (event) => {
        setCurrentEvent(event);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowDetailsModal(false);
        setCurrentEvent(null);
    };

    const handleSaveEvent = (event) => {
        if (currentEvent) {
            setEvents(events.map(e => e.id === event.id ? event : e));
        } else {
            setEvents([...events, { ...event, id: events.length + 1 }]);
        }
        handleCloseModal();
    };

    const handleViewDetails = (event) => {
        setCurrentEvent(event);
        setShowDetailsModal(true);
    };

    const currentDate = new Date();
    const upcomingEvents = events.filter(event => new Date(event.time) > currentDate)
                                 .sort((a, b) => new Date(a.time) - new Date(b.time));
    const pastEvents = events.filter(event => new Date(event.time) <= currentDate)
                                 .sort((a, b) => new Date(b.time) - new Date(a.time));;

    return (
        <div className="event-page">
            <button className="add-event-button" onClick={handleAddEvent}>Add Event</button>
            <section>
                <h2>Upcoming Events</h2>
                <EventList events={upcomingEvents.map(event => ({ ...event, time: event.time.toString() }))} onEdit={handleEditEvent} onViewDetails={handleViewDetails} />
            </section>
            <section className="past-events-section">
                <h2>Past Events</h2>
                <EventList events={pastEvents.map(event => ({ ...event, time: event.time.toString() }))} onEdit={handleEditEvent} onViewDetails={handleViewDetails} />
                <Link to="/past-events" className="more-link">
                    More
                </Link>
            </section>

            {showModal && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <AddEditEventForm event={currentEvent} onSave={handleSaveEvent} onCancel={handleCloseModal} />
                    </div>
                </div>
            )}

            {showDetailsModal && (
                <EventDetailModal event={currentEvent} onClose={handleCloseModal} />
            )}

        </div>
    );
};

export default EventPage;
