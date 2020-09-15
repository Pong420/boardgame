// @ts-check
const { defaults: tsjPreset } = require('ts-jest/presets');

/** @type {import('ts-jest')}  */
module.exports = {
  displayName: 'e2e',
  globalSetup: 'jest-environment-puppeteer/setup',
  globalTeardown: 'jest-environment-puppeteer/teardown',
  testRunner: 'jest-circus/runner',
  testMatch: ['<rootDir>/**/*(*.)@(e2e-spec|test).[tj]s?(x)'],
  testEnvironment: '<rootDir>/jest-environment.js',
  // testSequencer: '<rootDir>/jest-testSequencer.js',
  setupFilesAfterEnv: [
    'expect-puppeteer',
    '<rootDir>/jest.setup.ts',
    '<rootDir>/matchers/index.ts'
  ],
  transform: {
    ...tsjPreset.transform
  },
  globals: {
    testUrl: 'http://localhost:3000'
  }
};
