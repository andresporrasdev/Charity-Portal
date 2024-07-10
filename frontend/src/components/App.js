// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Navbar/Nav";
import Home from "./pages/Home";
import EventPage from "./pages/EventPage";
import PastEventPage from './pages/PastEventPage';
import Membership from "./pages/Membership";
import Volunteer from "./pages/Volunteer";
import News from "./pages/News";
import ContactUs from "./pages/ContactUs";
import LoginForm from "./components/LoginForm";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Footer from "./components/Footer/Footer"; 
import axios from "axios";
import { UserProvider } from "./UserContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo(token);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get("http://localhost:3000/api/user/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === "success") {
        const userData = response.data.data.user;
        setUserName(userData.first_name);
        setIsLoggedIn(true);
        console.log("fetchUserInfo:success");
      } else {
        console.error("Failed to fetch user info:", response.data.message);
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (error.response && error.response.data.message === "Token expired. Please login again.") {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("");
  };

  return (
    <Router>
      <UserProvider> 
        <div className="App">
          <Nav isLoggedIn={isLoggedIn} userName={userName} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event" element={<EventPage user={user}/>} />
            <Route path="/past-events" element={<PastEventPage />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
          <Footer />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
