import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid, TextField } from "@mui/material";
import EventList from "../components/Event/EventList";
import { fetchEvents } from "../components/Event/FetchEvent";

const PastEventPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchEvents().then((eventsData) => {
      const pastEvents = eventsData
        .filter((e) => new Date(e.time) <= new Date())
        .sort((a, b) => new Date(b.time) - new Date(a.time));
      setEvents(pastEvents);
      setFilteredEvents(pastEvents);
    });
  }, []);

  const filterEvents = (start, end) => {
    let filtered = events;
    if (start) filtered = filtered.filter((e) => new Date(e.time) >= new Date(start));
    if (end) filtered = filtered.filter((e) => new Date(e.time) <= new Date(end));
    setFilteredEvents([...filtered]);
  };

  const handleStartDateChange = (e) => { setStartDate(e.target.value); filterEvents(e.target.value, endDate); };
  const handleEndDateChange = (e) => { setEndDate(e.target.value); filterEvents(startDate, e.target.value); };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Past Events</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Start Date" type="date" value={startDate} onChange={handleStartDateChange}
            fullWidth InputLabelProps={{ shrink: true }} size="small" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="End Date" type="date" value={endDate} onChange={handleEndDateChange}
            fullWidth InputLabelProps={{ shrink: true }} size="small" />
        </Grid>
      </Grid>
      <EventList
        events={filteredEvents.map((e) => ({ ...e, time: e.time.toString() }))}
        onViewDetails={(e) => console.log("View details for event:", e)}
        hideActions
      />
    </Container>
  );
};

export default PastEventPage;
