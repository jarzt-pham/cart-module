module.exports = {
    testTimeout: 30000,
    globalSetup: './specs/jest/setup.js',
    globalTeardown: './specs/jest/teardown.js',
    reporters: ['default', './specs/jest/reporter.js'],
};
