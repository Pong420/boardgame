const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*(*.)@(e2e-spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  transform: {
    ...tsjPreset.transform
  }
};
