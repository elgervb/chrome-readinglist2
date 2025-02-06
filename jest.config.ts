import presets from 'jest-preset-angular/presets';
import { type JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';


export default {
  ...presets.createCjsPreset(),
  roots: [
    './src'
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
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.js']
} satisfies JestConfigWithTsJest;
