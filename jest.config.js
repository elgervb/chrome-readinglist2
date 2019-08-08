
module.exports = {
  roots: [
    './src/'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/src/test.ts',
    '<rootDir>/src/coverage',
    '<rootDir>/coverage',
    '<rootDir>/.*\.e2e\.ts'
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
      statements: 1,
      branches: 0,
      functions: 1,
      lines: 1
    }
  },
  moduleNameMapper: {

  },
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.js']
};
