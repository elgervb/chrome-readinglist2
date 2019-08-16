
module.exports = {
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
      statements: 35,
      branches: 10,
      functions: 19,
      lines: 30
    }
  },
  moduleNameMapper: {

  },
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.js']
};
