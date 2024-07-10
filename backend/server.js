// CONNECT DATABASE
const dotenv = require("dotenv");
dotenv.config(); // load environment variables from .env file
const mongoose = require("mongoose");
const app = require("./app");
const Role = require("./models/role");
const VolunteerRole = require("./models/volunteerRole");

console.log(process.env);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("DB Connection Successful");
    initializeRoles();
    initializeVolunteerRoles();
  })
  .catch((error) => {
    console.log("Some error has occured");
  });

// Initializes predefined roles in the MongoDB database
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

// Initializes predefined Voluntere roles in the MongoDB database

async function initializeVolunteerRoles() {
  const volunteerRoles = [
    { name: "Tea area", 
      description:"Guide guests at the Tea station: make sure snack tray is refilled: Tea cups/ sugar refilled etc." },
    { name: "Reception table",
      description: "Greet the members, ask them if they have the band, offer them the candy/flowers etc"
     },
    { name: "Door Greeter",
      description: "Check the wrist band at the Auditorium entrance and Dinner hall entrance and allow ppl inside"
     },
    { name: "Back Stage",
      description: "Help in organizing the performers in the green room: help certificate distribution: stage"
     },
    { name: "Comms",
      description: "Audio video coordination"
    },
    { name: "Dinner",
      description: "Help in organizing the dinner area"
     },
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

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
