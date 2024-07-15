const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { purge } = require('../app');
// Define Schema
const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    time: String,
    place: String,
    pricePublic: String,
    priceMember: String,
    isMemberOnly: Boolean,
    imageUrl: String,
    purchaseURL: String,
});

// create event
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;