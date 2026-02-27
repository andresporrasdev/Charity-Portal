const Event = require("../models/event");
const { uploadImage, multerErrorHandling } = require("../utils/uploads");
const { sendSuccess, sendFail, sendError } = require("../utils/apiResponse");
const path = require("path");
const Volunteer = require("../models/volunteerModel");
const serverBaseUrl = process.env.SERVER_BASE_URL;

// Route to handle image upload
async function handleFileUpload(req, res) {
  try {
    const filename = path.basename(req.file.path);
    const imageUrl = `${serverBaseUrl}/images/${filename}`;
    sendSuccess(res, 200, null, { message: "File uploaded successfully", imageUrl });
    console.log("Image uploaded successfully");
  } catch (error) {
    sendError(res, error.message);
    console.log("Error uploading image");
  }
}

// CRUD methods for event
exports.addEvent = async (req, res) => {
  const event = new Event(req.body);
  try {
    const savedEvent = await event.save();
    sendSuccess(res, 201, { event: savedEvent });
  } catch (err) {
    sendFail(res, 400, err.message);
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(0, parseInt(req.query.limit, 10) || 0); // 0 = no limit
    const skip = limit ? (page - 1) * limit : 0;

    const [events, totalResults] = await Promise.all([
      Event.find({}).skip(skip).limit(limit || undefined),
      Event.countDocuments({}),
    ]);

    const totalPages = limit ? Math.ceil(totalResults / limit) : 1;

    sendSuccess(res, 200, { events }, { results: events.length, totalResults, totalPages, currentPage: page });
  } catch (error) {
    sendError(res, "An error occurred while fetching events.");
  }
};

exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const updateData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

    if (!updatedEvent) {
      return sendFail(res, 404, "Event not found.");
    }

    sendSuccess(res, 200, { event: updatedEvent });
  } catch (error) {
    sendError(res, "An error occurred while updating the event.");
  }
};

exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    const deletedEvent = await Event.findOneAndDelete({ _id: eventId });

    if (!deletedEvent) {
      return sendFail(res, 404, "Event not found.");
    }

    await Volunteer.deleteMany({ event: eventId });

    sendSuccess(res, 200, null, { message: "Event deleted successfully." });
  } catch (error) {
    sendError(res, "An error occurred while deleting the event.");
  }
};

exports.getEventById = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      return sendFail(res, 404, "Event not found.");
    }

    sendSuccess(res, 200, { event });
  } catch (error) {
    sendError(res, "An error occurred while fetching the event.");
  }
};

exports.handleFileUpload = handleFileUpload;
exports.upload = uploadImage;
exports.multerErrorHandling = multerErrorHandling;
