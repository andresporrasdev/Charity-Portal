import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { UserContext, ROLES } from "../../UserContext";
import defaultImageSrc from "../../assets/defaultPostPic.png";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatEventTime = (time) => {
  const [datePart, timePart = ""] = time.split("T");
  const [year, month, day] = datePart.split("-");
  const monthLabel = MONTH_NAMES[parseInt(month, 10) - 1];
  return {
    date: `${monthLabel} ${parseInt(day, 10)}, ${year}`,
    time: timePart,
  };
};

const EventCard = ({ event, onEdit, onDelete, onViewDetails, hideActions }) => {
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [imgSrc, setImgSrc] = useState(event.imageUrl || defaultImageSrc);
  const { name, time, place, pricePublic, priceMember, isMemberOnly } = event;
  const { date: formattedDate, time: formattedTime } = formatEventTime(time);
  const navigate = useNavigate();

  const handleMenuOpen = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
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

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        borderRadius: "14px",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 14px rgba(0,0,0,0.06)",
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.13)",
        },
      }}
    >
      {/* Amber accent bar */}
      <Box
        sx={{
          height: "4px",
          background: "linear-gradient(90deg, #e88a1d 0%, #f4a94a 100%)",
          flexShrink: 0,
        }}
      />

      {/* Image area */}
      <Box
        onClick={() => onViewDetails(event)}
        sx={{
          height: 190,
          bgcolor: "#111827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={imgSrc}
          alt={name}
          onError={() => setImgSrc(defaultImageSrc)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            p: 2,
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.06)" },
          }}
        />
        {isMemberOnly && (
          <Chip
            label="Members Only"
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "#e88a1d",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.65rem",
              height: 22,
            }}
          />
        )}
      </Box>

      {/* Card content */}
      <CardContent sx={{ flexGrow: 1, p: "18px 20px 10px" }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 1.5, lineHeight: 1.25, color: "#0f172a", fontSize: "1rem" }}
        >
          {name}
        </Typography>

        <Stack spacing={0.75}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <CalendarTodayIcon sx={{ fontSize: 13, color: "#e88a1d", flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.78rem" }}>
              {formattedDate}{formattedTime ? ` · ${formattedTime}` : ""}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <LocationOnIcon sx={{ fontSize: 13, color: "#e88a1d", flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.78rem" }}>
              {place}
            </Typography>
          </Box>
        </Stack>

        {/* Price badges */}
        <Box sx={{ display: "flex", gap: 1, mt: 1.75, flexWrap: "wrap" }}>
          <Box
            sx={{
              px: 1.25,
              py: 0.4,
              bgcolor: "rgba(232,138,29,0.08)",
              borderRadius: "6px",
              border: "1px solid rgba(232,138,29,0.22)",
            }}
          >
            <Typography variant="caption" sx={{ color: "#c97818", fontWeight: 600, fontSize: "0.72rem" }}>
              Member ${priceMember}
            </Typography>
          </Box>
          {!isMemberOnly && (
            <Box
              sx={{
                px: 1.25,
                py: 0.4,
                bgcolor: "rgba(46,93,75,0.07)",
                borderRadius: "6px",
                border: "1px solid rgba(46,93,75,0.18)",
              }}
            >
              <Typography variant="caption" sx={{ color: "#2e5d4b", fontWeight: 600, fontSize: "0.72rem" }}>
                Public ${pricePublic}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      {!hideActions && (
        <CardActions sx={{ px: "20px", pb: "16px", pt: "4px", gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            onClick={handlePurchaseTicket}
            sx={{
              flex: 1,
              fontWeight: 600,
              fontSize: "0.78rem",
              bgcolor: "#e88a1d",
              "&:hover": { bgcolor: "#d4791a" },
            }}
          >
            Purchase Ticket
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleVolunteerClick}
            sx={{
              flex: 1,
              fontWeight: 600,
              fontSize: "0.78rem",
              borderColor: "#2e5d4b",
              color: "#2e5d4b",
              "&:hover": { borderColor: "#1f3f34", bgcolor: "rgba(46,93,75,0.05)" },
            }}
          >
            Volunteer
          </Button>
          {user?.roles.includes(ROLES.ADMIN) && (
            <>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon fontSize="small" />
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
