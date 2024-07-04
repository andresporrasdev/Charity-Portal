const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require("../models/event");
const multer = require('multer'); // For file upload
const fs = require('fs'); //For directory creation
const path = require('path'); //For directory creation

//CRUD methods for event

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
        const deletedEvent = await Event.findOneAndRemove({ id: eventId });
        
        //if (!deletedEvent) {
        //    return res.status(404).json({ message: "Event not found." });
        //}
        
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

//Upload images for events

// Directory where files will be uploaded
const uploadDir = 'public/images'; // Adjusted to use the public directory

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir); // Use the uploads directory
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname); //Create a unique filename
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

// Set up the multer object for filtering file size
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB max file size
    },
    fileFilter: fileFilter
});

// Route to handle file upload
async function handleFileUpload(req, res) {
    try {
        // Extract filename from the uploaded file path
        const filename = path.basename(req.file.path);

        // Construct the new URL
        const imageUrl = `http://localhost:3000/images/${filename}`;

        // Use the new imageUrl in the response
        res.status(200).json({
            message: 'File uploaded successfully',
            imageUrl: imageUrl // Updated to use the new URL
        });
        console.log("Image uploaded successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error uploading image");
    }
}

// Export the functions to be used in the routes
exports.handleFileUpload = handleFileUpload;
exports.upload = upload;
