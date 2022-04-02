import type { OverrideCreator } from '../src/types';

export const defaultProject: Parameters<OverrideCreator>[0] = {
  hasJest: false,
  hasJestDom: false,
  hasNest: false,
  hasNodeTypes: false,
  hasTestingLibrary: false,
  react: {
    hasReact: false,
    isCreateReactApp: false,
    isNext: false,
    isPreact: false,
    isRemix: false,
    version: null,
  },
  storybook: {
    hasStorybook: false,
    hasStorybookTestingLibrary: false,
  },
  typescript: {
    config: null,
    hasTypeScript: false,
    version: null,
  },
};
