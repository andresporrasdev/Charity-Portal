import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Nav from "./components/Navbar/Nav";
import Footer from "./components/Footer/Footer";
import { UserProvider } from "./UserContext";
import ProtectedRoute from "./router/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import EventPage from "./pages/EventPage";
import PastEventPage from "./pages/PastEventPage";
import Membership from "./pages/Membership";
import Volunteer from "./pages/Volunteer";
import PostPage from "./pages/PostPage";
import ContactUs from "./pages/ContactUs";
import Gallery from "./pages/Gallery";
import MemberManagePage from "./pages/MemberManagePage";
import VolunteerManagePage from "./pages/VolunteerManagePage";

import LoginForm from "./components/Login/LoginForm";
import Register from "./components/Register/Register";
import ResetPasswordPage from "./components/Login/ResetPasswordPage";
import AddPostForm from "./components/Post/AddPostForm";
import Policy from "./components/Volunteer/Policy";

function App() {
  return (
    <Router>
      <UserProvider>
        <ErrorBoundary>
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Nav />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/event" element={<EventPage />} />
                <Route path="/past-events" element={<PastEventPage />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/news" element={<PostPage />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/policy" element={<Policy />} />
                <Route
                  path="/member-manage"
                  element={
                    <ProtectedRoute requireAdmin>
                      <MemberManagePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/volunteer-manage"
                  element={
                    <ProtectedRoute requireAdmin>
                      <VolunteerManagePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-news"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AddPostForm standalone />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </ErrorBoundary>
      </UserProvider>
    </Router>
  );
}

export default App;
