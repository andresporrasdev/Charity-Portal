// Provide test-safe defaults for all required env vars.
// Real values from .env override these when the server runs normally.
// The CI workflow also sets these via `env:` blocks, which take precedence.
process.env.SECRET_STR = process.env.SECRET_STR || "jest-test-secret-do-not-use-in-prod";
process.env.LOGIN_EXPIRE = process.env.LOGIN_EXPIRE || "3600";
process.env.SERVER_PORT = process.env.SERVER_PORT || "3001";
process.env.CLIENT_ID = process.env.CLIENT_ID || "ci-placeholder";
process.env.CLIENT_SECRET = process.env.CLIENT_SECRET || "ci-placeholder";
process.env.REDIRECT_URI = process.env.REDIRECT_URI || "https://developers.google.com/oauthplayground";
process.env.REFRESH_TOKEN = process.env.REFRESH_TOKEN || "ci-placeholder";
process.env.SENDING_ADDRESS = process.env.SENDING_ADDRESS || "ci@example.com";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test-unused";
