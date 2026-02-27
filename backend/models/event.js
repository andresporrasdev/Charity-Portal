const mongoose = require('mongoose');
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