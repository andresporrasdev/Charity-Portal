import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const TIERS = [
  { label: "Individual", price: "$20", description: "Perfect for a single member" },
  { label: "Student", price: "$10", description: "Discounted rate for students" },
  { label: "Couple", price: "$30", description: "For two members together" },
  { label: "Family", price: "$45", description: "For the whole family" },
];

const BENEFITS = [
  "Reduced entry fee for New Year (January), Nowruz (April), Picnic (July), Christmas (December) events",
  "Up to 15% reduction in ticket costs for movies activities in Ottawa when purchased through the portal",
  "Attend Annual General Body Meetings with voting rights to nominate/elect executive committee members",
  "Access to member-only events and news",
];

function Membership() {
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ bgcolor: "secondary.main", color: "white", py: 8, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>Become a Member!</Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Join our growing family and enjoy exclusive benefits
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Benefits */}
        <Typography variant="h4" fontWeight={700} gutterBottom>Benefits of Membership</Typography>
        <Paper sx={{ p: 4, mb: 6 }}>
          <List>
            {BENEFITS.map((b, i) => (
              <ListItem key={i} alignItems="flex-start">
                <ListItemIcon sx={{ mt: 0.5, minWidth: 36 }}>
                  <CheckCircleOutlineIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={b} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Pricing cards */}
        <Typography variant="h4" fontWeight={700} gutterBottom>Membership Fees</Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {TIERS.map(({ label, price, description }) => (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <Card sx={{ height: "100%", textAlign: "center", border: "2px solid", borderColor: "primary.main" }}>
                <CardContent sx={{ py: 4 }}>
                  <Typography variant="h5" fontWeight={700} color="primary">{label}</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ my: 2 }}>{price}</Typography>
                  <Typography variant="body2" color="text.secondary">{description}</Typography>
                  <Typography variant="caption" color="text.secondary">per year</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Registration */}
        <Typography variant="h4" fontWeight={700} gutterBottom>How to Register</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: "100%", border: "2px solid", borderColor: "secondary.main" }}>
              <Typography variant="h6" fontWeight={700} color="secondary" gutterBottom>Option 1 – Annual Membership</Typography>
              <Typography variant="body1" paragraph>
                Purchase your annual membership to save money and support community events.
                Event ticket links will be sent through a separate email after membership purchase.
              </Typography>
              <Button variant="contained" color="secondary" href="https://www.eventbrite.ca" target="_blank" rel="noopener noreferrer">
                Purchase on Eventbrite
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: "100%", bgcolor: "#f9f9f9" }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Option 2 – Event Tickets Only</Typography>
              <Typography variant="body1" color="text.secondary">
                If you wish to purchase tickets for a specific event alone, please check back soon.
                Event-only ticket links will be available closer to each event date.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Membership;
