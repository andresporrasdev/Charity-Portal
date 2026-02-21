import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { UserContext, ROLES } from "../../UserContext";
import defaultImageSrc from "../../assets/defaultPostPic.png";

const EventCard = ({ event, onEdit, onDelete, onViewDetails, hideActions }) => {
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const { name, time, place, pricePublic, priceMember, isMemberOnly, imageUrl } = event;
  const formattedTime = time.replace("T", " ");
  const navigate = useNavigate();

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => { onEdit(event); handleMenuClose(); };
  const handleDelete = () => { onDelete(event._id); handleMenuClose(); };

  const handlePurchaseTicket = () => {
    if (isMemberOnly && !user?.roles.includes(ROLES.MEMBER)) {
      navigate("/membership");
    } else {
      window.open(event.purchaseURL, "_blank");
    }
  };

  const handleVolunteerClick = () => {
    navigate("/volunteer", { state: { eventId: event._id } });
  };

  const renderPrice = () => (
    <Box>
      <Typography variant="body2"><strong>Price (Member):</strong> {priceMember}</Typography>
      {!isMemberOnly && <Typography variant="body2"><strong>Price (Public):</strong> {pricePublic}</Typography>}
    </Box>
  );

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      {isMemberOnly && (
        <Chip
          label="Member Only"
          color="primary"
          size="small"
          sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
        />
      )}
      <CardMedia
        component="img"
        height="200"
        image={imageUrl || defaultImageSrc}
        alt={name}
        sx={{ objectFit: "cover", cursor: "pointer" }}
        onClick={() => onViewDetails(event)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>{name}</Typography>
        <Typography variant="body2" color="text.secondary"><strong>Time:</strong> {formattedTime}</Typography>
        <Typography variant="body2" color="text.secondary"><strong>Place:</strong> {place}</Typography>
        {renderPrice()}
      </CardContent>

      {!hideActions && (
        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" variant="contained" color="primary" onClick={handlePurchaseTicket}>
              Purchase Ticket
            </Button>
            <Button size="small" variant="outlined" color="secondary" onClick={handleVolunteerClick}>
              Volunteer
            </Button>
          </Box>
          {user?.roles.includes(ROLES.ADMIN) && (
            <>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default EventCard;
