const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require("../models/event");


//Insert an event
exports.addEvent = async (req, res) => {
    const event = new Event(req.body);
    try {
        const savedEvent = await event.save();
        res.status(200).json(savedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
//Get all event
exports.getAllEvents = async (req, res) => {
    
    try {
        const events = await Event.find({});
        res.status(200).json(events);
      } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ message: "An error occurred while fetching events." });
      }
};
//update an event
exports.updateEvent = async (req, res) => {
    const eventId = req.body.id;
    const newEventData = req.body;

    try {
        // delete old event
        const deletedEvent = await Event.findOneAndDelete({ id: eventId });
        
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found to delete." });
        }

        // insert new event
        const newEvent = new Event(newEventData);
        const savedEvent = await newEvent.save();

        res.status(200).json(savedEvent);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while updating the event." });
    }
};
//delte event
exports.deleteEvent = async (req, res) => {
    const eventId = req.params.id;
    
    try {
        const deletedEvent = await Event.findByIdAndRemove(eventId);
        
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }
        
        res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting the event." });
    }
};
//Get event by id
exports.getEventById = async (req, res) => {
    const eventId = req.params.id;

    try {
        const event = await Event.findOne({ id: eventId });

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching the event." });
    }
};

