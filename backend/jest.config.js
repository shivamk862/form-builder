module.exports = {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testTimeout: 30000,
  globalSetup: './tests/setup.js',
  globalTeardown: './tests/teardown.js',
};