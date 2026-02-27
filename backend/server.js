// CONNECT DATABASE
const dotenv = require("dotenv");
dotenv.config(); // load environment variables from .env file
const validateEnv = require("./utils/validateEnv");
validateEnv(); // fail fast if required vars are missing
const mongoose = require("mongoose");
const app = require("./app");
const { updateUserStatuses, saveAllUsersToDBFromMockFile } = require("./controllers/userController");
const { initializeRoles, initializeVolunteerRoles, initializeDatabase, createDummyPost } = require("./utils/init");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(async (conn) => {
    console.log("DB Connection Successful");
    await initializeRoles();
    await initializeVolunteerRoles();
    await initializeDatabase();
    await createDummyPost();
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });

// Start the server
const port = process.env.SERVER_PORT;

app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);

  try {
    await saveAllUsersToDBFromMockFile();
    await updateUserStatuses();
    console.log("Initialization complete. The server is now ready.");
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
