import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const EventDetailModal = ({ event, onClose }) => {
  const navigate = useNavigate();
  const isPastEvent = new Date(event.time) <= new Date();

  const handlePurchaseTicket = () => {
    window.location.href = event.purchaseURL;
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event.name}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>{event.description}</Typography>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="body2"><strong>Time:</strong> {event.time}</Typography>
          <Typography variant="body2"><strong>Place:</strong> {event.place}</Typography>
          <Typography variant="body2"><strong>Price (Member):</strong> {event.priceMember}</Typography>
          {!event.isMemberOnly && (
            <Typography variant="body2"><strong>Price (Public):</strong> {event.pricePublic}</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {!isPastEvent && (
          <>
            <Button variant="contained" color="primary" onClick={handlePurchaseTicket}>
              Purchase Ticket
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate("/volunteer")}>
              Volunteer
            </Button>
          </>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailModal;
