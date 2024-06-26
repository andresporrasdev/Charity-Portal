import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Nav';
import Home from './components/Home';
import Event from './components/Event';
import Membership from './components/Membership';
import Volunteer from './components/Volunteer';
import News from './components/News';
import ContactUs from './components/ContactUs';
import LoginForm from './components/LoginForm';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import AdminDashboard from './components/AdminDashboard';
import MemberManagement from './components/MemberManagement';
import EventManagement from './components/EventManagement';
import MemberDashboard from './components/MemberDashboard';
import MemberEventPage from './components/MemberEventPage';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/event" element={<Event />} />
      <Route path="/membership" element={<Membership />} />
      <Route path="/volunteer" element={<Volunteer />} />
      <Route path="/news" element={<News />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/members" element={<MemberManagement />} />
      <Route path="/admin/events" element={<EventManagement />} />
      <Route path="/member/dashboard" element={<MemberDashboard />} />
      <Route path="/member/events" element={<MemberEventPage />} />
    </Routes>
  </Router>
);

export default App;