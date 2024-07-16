const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Schema
const commSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    imageUrl: {type: String},
    attachmentUrl: {type: String},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
});