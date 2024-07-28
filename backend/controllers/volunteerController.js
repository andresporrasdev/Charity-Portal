// Import the Volunteer model
const Volunteer = require("../models/volunteerModel");
const VolunteerRole = require("../models/volunteerRole");
const { sendEmailWithImageAttachment } = require("./../utils/email");

// Mock database for demonstration purposes
let volunteers = [];

// Route to handle volunteer sign-up
const volunteerSignUp = async (req, res) => {
  // Assuming all validations are done in the frontend

  try {
    // Create a new volunteer document using the Volunteer model
    const newVolunteer = new Volunteer(req.body);
    console.log(`New volunteer signed up: ${newVolunteer}`);
    // Save the new volunteer document to the database
    await newVolunteer.save();

    // Respond with success message and the saved volunteer document
    res.status(201).json({ message: "Volunteer signed up successfully!", volunteer: newVolunteer });
  } catch (error) {
    // Handle errors (e.g., validation errors or MongoDB errors)
    res.status(400).json({ message: "Error signing up volunteer", error: error.message });
  }
};

// Route to get all volunteers (for demonstration)
const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate("preferredRole", "name").populate("event", "name");

    // const volunteersWithRoleName = volunteers.map((volunteer) => ({
    //   ...volunteer.toObject(),
    //   preferredRole: volunteer.preferredRole.name,
    // }));

    const volunteersWithData = volunteers.map((volunteer) => ({
      ...volunteer.toObject(),
      preferredRole: volunteer.preferredRole ? volunteer.preferredRole.name : null,
      event: volunteer.event ? volunteer.event.name : null,
    }));
    res.status(200).json({
      status: "success",
      results: volunteersWithData.length,
      data: { volunteers: volunteersWithData },
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      status: "error",
      message: "Error getting volunteers",
      error: error.message,
    });
  }
};

// Route to get volunteers by event ID
const getVolunteersByEventId = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ event: req.params.eventId })
      .populate("preferredRole", "name")
      .populate("event", "name");

    const volunteersWithData = volunteers.map((volunteer) => ({
      ...volunteer.toObject(),
      preferredRole: volunteer.preferredRole ? volunteer.preferredRole.name : null,
      event: volunteer.event ? volunteer.event.name : null,
    }));

    res.status(200).json({
      status: "success",
      results: volunteersWithData.length,
      data: { volunteers: volunteersWithData },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error getting volunteers for the event",
      error: error.message,
    });
  }
};

// Update volunteer
const updateVolunteer = async (req, res) => {
  try {
    const filterObj = (obj, ...allowedFields) => {
      const newObj = {};
      Object.keys(obj).forEach((key) => {
        if (allowedFields.includes(key)) {
          newObj[key] = obj[key];
        }
      });
      return newObj;
    };

    const filteredBody = filterObj(req.body, "preferredRole");
    const volunteerRole = await VolunteerRole.findOne({ name: filteredBody.preferredRole });

    if (!volunteerRole) {
      throw new Error(`Role not found: ${filteredBody.preferredRoleName}`);
    }

    const update = { preferredRole: volunteerRole._id };

    // Update volunteer document by ID with filteredBody
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, update, {
      new: true, // Return the updated document
      runValidators: true, // Run validators on update
    });

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
};

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
};

const notifyVolunteers = async (req, res) => {
  try {
    await sendEmailWithImageAttachment(req, res);
  } catch (error) {
    console.error("Error notifying volunteers:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to notify volunteers.",
    });
  }
};

module.exports = {
  volunteerSignUp,
  getAllVolunteers,
  updateVolunteer,
  deleteVolunteer,
  getVolunteersByEventId,
  notifyVolunteers,
};
