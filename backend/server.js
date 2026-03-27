// CONNECT DATABASE
const dotenv = require("dotenv");
dotenv.config(); // load environment variables from .env file
const validateEnv = require("./utils/validateEnv");
validateEnv(); // fail fast if required vars are missing
const mongoose = require("mongoose");
const app = require("./app");
const { updateUserStatuses, saveAllUsersToDBFromMockFile } = require("./controllers/userController");
const { initializeRoles, initializeVolunteerRoles, initializeDatabase, createDummyPost } = require("./utils/init");

const port = process.env.SERVER_PORT;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
    });
    console.log("DB Connection Successful");

    await initializeRoles();
    await initializeVolunteerRoles();
    await initializeDatabase();
    await createDummyPost();
    await saveAllUsersToDBFromMockFile();
    await updateUserStatuses();

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
      console.log("Initialization complete. The server is now ready.");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
