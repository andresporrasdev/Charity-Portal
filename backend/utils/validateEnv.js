const REQUIRED_VARS = [
  "MONGODB_URI",
  "SECRET_STR",
  "LOGIN_EXPIRE",
  "SERVER_PORT",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "REDIRECT_URI",
  "REFRESH_TOKEN",
  "SENDING_ADDRESS",
];

const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[startup] Missing required environment variables:\n  ${missing.join("\n  ")}\n` +
        "Copy backend/.env.example to backend/.env and fill in the values."
    );
    process.exit(1);
  }
};

module.exports = validateEnv;
