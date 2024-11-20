const Event = require("../models/event");
const { upload, multerErrorHandling } = require("../utils/uploads"); // Import from uploads.js
const path = require("path");
const Volunteer = require("../models/volunteerModel");
const serverBaseUrl = process.env.SERVER_BASE_URL;


// Route to handle file upload
async function handleFileUpload(req, res) {
  try {
    // Extract filename from the uploaded file path
    const filename = path.basename(req.file.path);

    // Construct the new URL
    const imageUrl = `${serverBaseUrl}:${process.env.SERVER_PORT}/images/${filename}`;

    // Use the new imageUrl in the response
    res.status(200).json({
      status: "success",
      message: "File uploaded successfully",
      imageUrl: imageUrl,
    });
    console.log("Image uploaded successfully");
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
    console.log("Error uploading image");
  }
}

// CRUD methods for event
// Insert an event
exports.addEvent = async (req, res) => {
  //console.log("Request body in AddEvent", req.body);
  const event = new Event(req.body);
  try {
    const savedEvent = await event.save();
    //console.log("Event saved successfully", savedEvent);
    res.status(200).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "An error occurred while fetching events." });
  }
};

// Update event with new version using patch
exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const updateData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the event.", error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    const deletedEvent = await Event.findOneAndDelete({ _id: eventId });

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    //delete all volunteers associated with the event
    await Volunteer.deleteMany({ event: eventId });

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting the event." });
  }
};

// Get event by id
exports.getEventById = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the event." });
  }
};

// Export the functions to be used in the routes
exports.handleFileUpload = handleFileUpload;
exports.upload = upload;
exports.multerErrorHandling = multerErrorHandling;
