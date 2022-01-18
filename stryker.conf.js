/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 * @link https://github.com/stryker-mutator/stryker/blob/master/packages/core/README.md#configuration
 */
 module.exports = {
  allowConsoleColors: true,
  coverageAnalysis: 'off',
  htmlReporter: {
    baseDir: 'coverage/mutation/html',
  },
  jest: {
    config: require('./jest.config.js'),
    enableFindRelatedTests: true,
    projectType: 'custom', // ignored when the config option is specified.
  },
  logLevel: 'info',
  concurrency: 2,
  mutator: {
    excludedMutations: ['StringLiteral', 'BlockStatement'],
  },
  packageManager: 'yarn',
  reporters: ['progress', 'html', 'clear-text'],
  testRunner: 'jest',
  tsconfigFile: 'tsconfig.spec.json'
};
