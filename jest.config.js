
module.exports = {
  preset: 'jest-preset-angular',
  roots: [
    './src/'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/src/test.ts',
    '<rootDir>/src/coverage',
    '<rootDir>/coverage'
  ],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/src/setup-jest.js',
    '!**/src/**/index.ts',
    '!**/src/**/*.module.ts'
  ],
  coverageReporters: [
    'json',
    'lcov',
    'text-summary'
  ],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 35,
      functions: 50,
      lines: 50
    }
  },
  moduleNameMapper: {

  },
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.js']
};
