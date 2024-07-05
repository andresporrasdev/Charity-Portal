import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Nav from "./components/Navbar/Nav";
import Home from "./pages/Home";
import Event from "./pages/EventPage";
import PastEventPage from "./pages/PastEventPage";
import Membership from "./pages/Membership";
import Volunteer from "./pages/Volunteer";
import News from "./pages/News";
import ContactUs from "./pages/ContactUs";
import LoginForm from "./components/LoginForm";
import Register from "./components/Register";
import MemberManageTable from "./components/MemberManageTable";
import ResetPasswordPage from "./components/ResetPasswordPage";
import Footer from "./components/Footer/Footer";
import axios from "axios";
import { UserProvider } from "./UserContext";

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
    // <UserContext.Provider value={user}>
    <Router>
      <UserProvider>
        <div className="App">
          <Nav isLoggedIn={isLoggedIn} userName={user?.first_name} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event" element={<Event />} />
            <Route path="/past-events" element={<PastEventPage />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/member-manage" element={<MemberManageTable />} />
          </Routes>
          <Footer />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
