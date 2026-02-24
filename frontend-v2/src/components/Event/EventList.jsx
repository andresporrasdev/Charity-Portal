import React from "react";
import { Grid } from "@mui/material";
import EventCard from "./EventCard";

const EventList = ({
  events,
  onEdit = () => {},
  onDelete = () => {},
  onViewDetails = () => {},
  hideActions = false,
}) => {
  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event._id}>
          <EventCard
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
            hideActions={hideActions}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default EventList;
