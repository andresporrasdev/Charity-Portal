// src/components/Home.js
import React, { useState, useEffect } from "react";
import home1 from "../image/home1.jpg";
import home2 from "../image/home2.jpg";
import { fetchEvents } from "../components/Event/FetchEvent";
import EventList from "../components/Event/EventList";
import PostList from "../components/Post/PostList";
import "./Home.css";
import BaseURL from "../config";
import axios from "axios";

function Home() {
  const [currentHome, setCurrentHome] = useState(1); // State to track the current home picture
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [posts, setPosts] = useState([]);

  const prevHome = () => {
    setCurrentHome(1);
  };

  const nextHome = () => {
    setCurrentHome(2);
  };

  useEffect(() => {
    const fetchAndSetEvents = async () => {
      const eventsData = await fetchEvents();
      const currentDate = new Date();
      const filteredEvents = eventsData
        .filter((event) => new Date(event.time) > currentDate)
        .sort((a, b) => new Date(a.time) - new Date(b.time));
      setUpcomingEvents(filteredEvents.slice(0, 3));
    };

    fetchAndSetEvents();
  }, []);

  useEffect(() => {
    const fetchPostsForNonMember = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/post/getPostsForNonMember`);
        const recentPosts = response.data.slice(-3); // Get the last 3 posts
        setPosts(recentPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };
    fetchPostsForNonMember();
  }, []);

  return (
    <div className="home-container">
      <div className="home-picture">
        <img src={currentHome === 1 ? home1 : home2} className="homepic" alt="Home" />

        {currentHome === 2 && (
          <div className="arrow arrow-left" onClick={prevHome}>
            &#9664;
          </div>
        )}
        {currentHome === 1 && (
          <div className="arrow arrow-right" onClick={nextHome}>
            &#9654;
          </div>
        )}
      </div>

      <div className="intro">
        <p>The Charity Organization Portal welcomes all people in Ottawa.</p>
        <p>
          Our community is a growing community of people who share their love for others.
          The Charity Organization conducts various events and fun activities throughout the year to nurture the community.
        </p>
        <a href="/Register">Join Us</a>
      </div>

      <div className="events">
        <h2>Events</h2>
        <EventList
          events={upcomingEvents.map((event) => ({ ...event, time: event.time.toString() }))}
          onViewDetails={(event) => console.log("View details for event:", event)}
        />
      </div>

      <div className="news">
        <h2>News</h2>
        <PostList posts={posts.slice(0, 3).reverse()} />
      </div>
    </div>
  );
}

export default Home;
