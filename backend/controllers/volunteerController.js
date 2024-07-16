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
        console.log(`New volunteer signed up: ${newVolunteer}`)
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
    try {
        // Find all volunteer documents in the database
        volunteers = Volunteer.find();
        res.status(200).json({
            status: "success",
            data:{
                volunteers
            },
        });

    } catch (error) {
        // Handle errors
        res.status(500).json({ 
            status: "error",
            message: "Error getting volunteers",
            error: error.message });
    }
};

// Update volunteer
const updateVolunteer = async (req, res) => {
      // check if request data contain password
  if (req.body.password) {
    res.status(400).json({
      status: "fail",
      message: "You can't update password using this endpoint.",
    });
  }

    try {
        
        const volunteer = await Volunteer.findByIdAndUpdate(req.params.id);
        // Save the new volunteer document to the database
        await volunteer.save();
        console.log(`Volunteer updated: ${volunteer}`)


        if (!volunteer) {
            return res.status(404).json({
              status: "fail",
              message: "No volunteer found with that ID.",
            });
          }

        res.status(200).json({
            status: "Success",
            data: {
                user: volunteer,
            },
        });
    
    } catch (error) {
        console.error("Error updating volunteer:", error);
        res.status(500).json({
          status: "error",
          message: "Failed to update volunteer.",
        });
      }
}

// Delete volunteer
const deleteVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
        if (!volunteer) {
            return res.status(404).json({
                status: "fail",
                message: "No volunteer found with that ID.",
            });
        }
        res.status(200).json({
            status: "Success",
            message: "Volunteer deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting volunteer:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to delete volunteer.",
        });
    }
}

module.exports = {
    volunteerSignUp,
    getAllVolunteers,
    updateVolunteer,
    deleteVolunteer,
};