import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Skeleton,
} from "@mui/material";
import { fetchEvents } from "../components/Event/FetchEvent";
import EventList from "../components/Event/EventList";
import PostList from "../components/Post/PostList";
import BaseURL from "../config";
import axios from "axios";
import home1 from "../assets/home1.jpg";
import home2 from "../assets/home2.jpg";

const SLIDES = [
  { src: home1, title: "Welcome to Charity Organization", subtitle: "Building community, one event at a time" },
  { src: home2, title: "Join Our Growing Family", subtitle: "Events, volunteering, and membership opportunities" },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchEvents().then((eventsData) => {
      const currentDate = new Date();
      const filtered = eventsData
        .filter((e) => new Date(e.time) > currentDate)
        .sort((a, b) => new Date(a.time) - new Date(b.time));
      setUpcomingEvents(filtered.slice(0, 3));
      setLoadingEvents(false);
    });
  }, []);

  useEffect(() => {
    axios
      .get(`${BaseURL}/api/post/getPostsForNonMember`)
      .then((r) => {
        setPosts(r.data.slice(-3).reverse());
        setLoadingPosts(false);
      })
      .catch(() => { setPosts([]); setLoadingPosts(false); });
  }, []);

  return (
    <Box>
      {/* Hero Carousel */}
      <Box sx={{ position: "relative", height: { xs: 300, sm: 420, md: 560 }, overflow: "hidden" }}>
        {SLIDES.map((slide, i) => (
          <Box
            key={i}
            component="img"
            src={slide.src}
            alt={slide.title}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: i === currentSlide ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        ))}
        {/* Overlay + CTA */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            pb: { xs: 4, md: 8 },
            px: 2,
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight={700} gutterBottom sx={{ fontSize: { xs: "1.6rem", sm: "2.4rem", md: "3rem" } }}>
            {SLIDES[currentSlide].title}
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>{SLIDES[currentSlide].subtitle}</Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
            <Button variant="contained" color="primary" size="large" href="/register" sx={{ fontWeight: 700 }}>
              Join Us
            </Button>
            <Button variant="outlined" size="large" href="/event" sx={{ color: "white", borderColor: "white", "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}>
              See Events
            </Button>
          </Box>
        </Box>
        {/* Dots */}
        <Box sx={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 1 }}>
          {SLIDES.map((_, i) => (
            <Box
              key={i}
              onClick={() => setCurrentSlide(i)}
              sx={{
                width: 10, height: 10, borderRadius: "50%", cursor: "pointer",
                bgcolor: i === currentSlide ? "primary.main" : "rgba(255,255,255,0.6)",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Intro section */}
      <Box sx={{ bgcolor: "secondary.main", color: "white", py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
            About Us
          </Typography>
          <Typography align="center" variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
            The Charity Organization Portal welcomes all people in Ottawa.
            Our community is a growing community of people who share their love for others.
            We conduct various events and fun activities throughout the year to nurture the community.
          </Typography>
        </Container>
      </Box>

      {/* Upcoming Events */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Upcoming Events</Typography>
        {loadingEvents ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                <Skeleton sx={{ mt: 1 }} />
                <Skeleton width="60%" />
              </Grid>
            ))}
          </Grid>
        ) : upcomingEvents.length > 0 ? (
          <EventList events={upcomingEvents.map((e) => ({ ...e, time: e.time.toString() }))} hideActions />
        ) : (
          <Typography color="text.secondary">No upcoming events at the moment.</Typography>
        )}
        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" color="secondary" href="/event">View All Events →</Button>
        </Box>
      </Container>

      {/* Latest News */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} gutterBottom>Latest News</Typography>
          {loadingPosts ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                  <Skeleton sx={{ mt: 1 }} />
                  <Skeleton width="60%" />
                </Grid>
              ))}
            </Grid>
          ) : posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <Typography color="text.secondary">No news at the moment.</Typography>
          )}
          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" color="secondary" href="/news">Read All News →</Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
