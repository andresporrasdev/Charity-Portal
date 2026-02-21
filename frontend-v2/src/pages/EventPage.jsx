import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import axios from "axios";
import EventList from "../components/Event/EventList";
import AddEditEventForm from "../components/Event/AddEditEventForm";
import EventDetailModal from "../components/Event/EventDetailModal";
import { fetchEvents } from "../components/Event/FetchEvent";
import { UserContext, ROLES } from "../UserContext";
import ConfirmModal from "../components/ConfirmModal.jsx";
import BaseURL from "../config";

const EventPage = () => {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const fetchAndSetEvents = async () => {
    const eventsData = await fetchEvents();
    setEvents(eventsData);
  };

  useEffect(() => { fetchAndSetEvents(); }, []);

  const handleSaveEvent = async (event) => {
    try {
      if (currentEvent?._id) {
        await axios.patch(`${BaseURL}/api/event/updateEvent/${currentEvent._id}`, event);
      } else {
        await axios.post(`${BaseURL}/api/event/addEvent`, event);
      }
      await fetchAndSetEvents();
      setShowModal(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const confirmEventDeletion = async () => {
    try {
      await axios.delete(`${BaseURL}/api/event/deleteEvent/${eventToDelete}`);
      await fetchAndSetEvents();
      setConfirmModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const currentDate = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.time) > currentDate)
    .sort((a, b) => new Date(a.time) - new Date(b.time));
  const pastEvents = events
    .filter((e) => new Date(e.time) <= currentDate)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 4);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {user?.roles.includes(ROLES.ADMIN) && (
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" color="primary" onClick={() => { setCurrentEvent(null); setShowModal(true); }}>
            + Add Event
          </Button>
        </Box>
      )}

      <Typography variant="h4" fontWeight={700} gutterBottom>Upcoming Events</Typography>
      <EventList
        events={upcomingEvents.map((e) => ({ ...e, time: e.time.toString() }))}
        onEdit={(event) => { setCurrentEvent(event); setShowModal(true); }}
        onDelete={(id) => { setEventToDelete(id); setConfirmModalOpen(true); }}
        onViewDetails={(event) => { setCurrentEvent(event); setShowDetailsModal(true); }}
      />

      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Past Events</Typography>
        <EventList
          events={pastEvents.map((e) => ({ ...e, time: e.time.toString() }))}
          onEdit={(event) => { setCurrentEvent(event); setShowModal(true); }}
          onDelete={(id) => { setEventToDelete(id); setConfirmModalOpen(true); }}
          onViewDetails={(event) => { setCurrentEvent(event); setShowDetailsModal(true); }}
          hideActions
        />
        <Box sx={{ mt: 2 }}>
          <Button component={Link} to="/past-events" variant="outlined" color="secondary">
            See All Past Events →
          </Button>
        </Box>
      </Box>

      {/* Add/Edit Event Dialog */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <Box sx={{ position: "relative" }}>
          <IconButton sx={{ position: "absolute", right: 8, top: 8, zIndex: 1 }} onClick={() => setShowModal(false)}>
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <AddEditEventForm event={currentEvent} onSave={handleSaveEvent} onCancel={() => setShowModal(false)} />
          </DialogContent>
        </Box>
      </Dialog>

      {showDetailsModal && currentEvent && (
        <EventDetailModal event={currentEvent} onClose={() => { setShowDetailsModal(false); setCurrentEvent(null); }} />
      )}

      <ConfirmModal
        title="Confirm Delete"
        text="Are you sure you want to delete this event? Deleting this event will also delete all associated volunteers. Please type 'DELETE' to confirm."
        open={confirmModalOpen}
        onConfirm={confirmEventDeletion}
        onClose={() => setConfirmModalOpen(false)}
        confirmWord="DELETE"
      />
    </Container>
  );
};

export default EventPage;
