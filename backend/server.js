// CONNECT DATABASE
const dotenv = require("dotenv");
dotenv.config(); // load environment variables from .env file
const mongoose = require("mongoose");
const app = require("./app");
const Role = require("./models/role");

console.log(process.env);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("DB Connection Successful");
    initializeRoles();
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

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
