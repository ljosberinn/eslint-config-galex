import type {
  Dependencies,
  ESLintConfig,
  TopLevelESLintConfig,
} from '../types';

export const plugins = ['import', 'unicorn', 'promise', 'sonarjs'];

/**
 * @see https://www.npmjs.com/org/testing-library
 */
export const testingLibFamily = [
  'angular',
  'cypress',
  'dom',
  // jasmine-dom
  // jest-dom
  // jest-native
  'nightwatch',
  'preact',
  'preact-hooks',
  'react',
  'react-hooks',
  'react-native',
  'svelte',
  'testcafe',
  // user-event
  'vue',
];

export const detectEnv = (
  dependencies: Dependencies,
  customEnv?: ESLintConfig['env']
): Required<TopLevelESLintConfig['env']> => {
  const browser = dependencies.react.hasReact;
  const node = dependencies.typescript.hasTypeScript
    ? dependencies.hasNest || dependencies.hasNodeTypes
    : true;

  return {
    browser,
    node,
    ...customEnv,
  };
};

export const detectParserOptions = (
  customParserOptions?: ESLintConfig['parserOptions']
): Required<TopLevelESLintConfig['parserOptions']> => {
  const ecmaVersion = customParserOptions?.ecmaVersion ?? 'latest';
  const sourceType = customParserOptions?.sourceType ?? 'module';

  const ecmaFeatures = customParserOptions?.ecmaFeatures ?? {};

  return {
    ecmaVersion,
    sourceType,
    ecmaFeatures,
  };
};
