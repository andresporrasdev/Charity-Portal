import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Event from "./components/Event";
import Membership from "./components/Membership";
import Volunteer from "./components/Volunteer";
import News from "./components/News";
import ContactUs from "./components/ContactUs";
import LoginForm from "./components/LoginForm";
import Register from "./components/Register";
import MemberManageTable from "./components/MemberManageTable";
import ResetPasswordPage from "./components/ResetPasswordPage";
import axios from "axios";
import UserContext from "./UserContext";
import AdminDashboard from './components/AdminDashboard';
import MemberManagement from './components/MemberManagement';
import EventManagement from './components/EventManagement';
import MemberDashboard from './components/MemberDashboard';
import MemberEventPage from './components/MemberEventPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
        setUser(userData);
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
    setUser(null);
  };

  return (
    <UserContext.Provider value={user}>
      <Router>
        <div className="App">
          <Nav isLoggedIn={isLoggedIn} userName={user?.first_name} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event" element={<Event />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/member-manage" element={<MemberManageTable />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/members" element={<MemberManagement />} />
      <Route path="/admin/events" element={<EventManagement />} />
      <Route path="/member/dashboard" element={<MemberDashboard />} />
      <Route path="/member/events" element={<MemberEventPage />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
