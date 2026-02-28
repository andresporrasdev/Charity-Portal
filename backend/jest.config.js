/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  setupFiles: ["./jest.setup.js"], // set required env vars before any test module loads
  testMatch: ["**/__tests__/**/*.test.js"],
  coverageProvider: "v8",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "controllers/**/*.js",
    "utils/**/*.js",
    "models/**/*.js",
    "!utils/validateEnv.js", // startup-only, not testable in isolation
    "!utils/email.js",       // Gmail OAuth transport — requires real credentials
    "!utils/emailHelper.js", // depends on email.js, mocked in tests
    "!utils/init.js",        // DB seed helper, runs at startup only
  ],
  coverageThreshold: {
    global: {
      lines: 40, // start at 40%, raise to 70% as tests are added
    },
  },
  // Give mongodb-memory-server time to download/start
  testTimeout: 30000,
};
