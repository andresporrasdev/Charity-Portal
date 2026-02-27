/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "controllers/**/*.js",
    "utils/**/*.js",
    "models/**/*.js",
    "!utils/validateEnv.js", // startup-only, not testable in isolation
  ],
  coverageThreshold: {
    global: {
      lines: 40, // start at 40%, raise to 70% as tests are added
    },
  },
  // Give mongodb-memory-server time to download/start
  testTimeout: 30000,
};
