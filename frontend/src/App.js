// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import Event from './components/Event';
import Membership from './components/Membership';
import Volunteer from './components/Volunteer';
import News from './components/News';
import ContactUs from './components/ContactUs';

function App() {
    return (
        <Router>
            <div className="App">
                <Nav />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/event" element={<Event />} />
                    <Route path="/membership" element={<Membership />} />
                    <Route path="/volunteer" element={<Volunteer />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
