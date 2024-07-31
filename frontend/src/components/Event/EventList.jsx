import React from "react";
import EventCard from "./EventCard";
import "./Event.css";

const EventList = ({ events, onEdit, onDelete, onViewDetails, hideActions }) => {
  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          hideActions={hideActions}
        />
      ))}
    </div>
  );
};

export default EventList;
