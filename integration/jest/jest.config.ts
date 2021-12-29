import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  errorOnDeprecated: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  snapshotFormat: {
    printBasicPrototype: false,
  },
};

export default config;
