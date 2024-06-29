const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Define Schema
const eventSchema = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    time: String,
    place: String,
    pricePublic: String,
    priceMember: String,
    isMemberOnly: Boolean,
    imageUrl: String
});

// create event
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;