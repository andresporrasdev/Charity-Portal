const mongoose = require("mongoose");
const Role = require("../models/role");
const VolunteerRole = require("../models/volunteerRole");
const Post = require("../models/postModel");
const { seedEvents } = require("./seedEvents");

async function initializeRoles() {
  const roles = [
    { name: "Member" },
    { name: "Administrator" },
    { name: "Organizer" },
    { name: "Volunteer" },
    { name: "Performer" },
  ];

  for (const role of roles) {
    const existingRole = await Role.findOne({ name: role.name });
    if (!existingRole) {
      const newRole = new Role(role);
      await newRole.save();
    }
  }
  console.log("Roles created successfully!");
}

async function initializeVolunteerRoles() {
  const volunteerRoles = [
    {
      name: "Tea area",
      description: "Guide guests at the Tea station: make sure snack tray is refilled: Tea cups/ sugar refilled etc.",
    },
    {
      name: "Reception table",
      description: "Greet the members, ask them if they have the band, offer them the candy/flowers etc",
    },
    {
      name: "Door Greeter",
      description: "Check the wrist band at the Auditorium entrance and Dinner hall entrance and allow ppl inside",
    },
    {
      name: "Back Stage",
      description: "Help in organizing the performers in the green room: help certificate distribution: stage",
    },
    { name: "Comms", description: "Audio video coordination" },
    { name: "Dinner", description: "Help in organizing the dinner area" },
  ];

  for (const role of volunteerRoles) {
    const existingRole = await VolunteerRole.findOne({ name: role.name });
    if (!existingRole) {
      const newRole = new VolunteerRole(role);
      await newRole.save();
    }
  }

  console.log("Volunteer Roles created successfully!");
}

async function initializeDatabase() {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    if (!collectionNames.includes("events")) {
      console.log("No events collection found, seeding charity events...");
      await seedEvents();
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

async function createDummyPost() {
  const postCount = await Post.countDocuments();
  if (postCount === 0) {
    const post = new Post({
      subject: "Hello, World!",
      content: "This is a sample post.",
    });
    await post.save();
    console.log("Dummy post created successfully!");
  } else {
    console.log("Posts already exist in the database. No dummy post created.");
  }
}

module.exports = { initializeRoles, initializeVolunteerRoles, initializeDatabase, createDummyPost };
