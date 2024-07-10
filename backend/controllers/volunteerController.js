// Import the Volunteer model
const Volunteer = require('../models/volunteerModel');


const express = require('express');
const router = express.Router();

// Mock database for demonstration purposes
let volunteers = [];

// Route to handle volunteer sign-up
const volunteerSignUp = async (req, res) => {
    // Assuming all validations are done in the frontend

    try {
        // Create a new volunteer document using the Volunteer model
        const newVolunteer = new Volunteer(req.body);
        // console.log(`New volunteer signed up: ${newVolunteer}`)
        // Save the new volunteer document to the database
        await newVolunteer.save();

        // Respond with success message and the saved volunteer document
        res.status(201).json({ message: 'Volunteer signed up successfully!', volunteer: newVolunteer });
    } catch (error) {
        // Handle errors (e.g., validation errors or MongoDB errors)
        res.status(400).json({ message: 'Error signing up volunteer', error: error.message });
    }
};

// Route to get all volunteers (for demonstration)
const getAllVolunteers =  (req, res) => {
    res.status(200).json(volunteers);
};

module.exports = {
    volunteerSignUp,
    getAllVolunteers
};