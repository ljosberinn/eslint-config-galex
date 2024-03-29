import {
  type Dependencies,
  type ESLintConfig,
  type TopLevelESLintConfig,
} from '../types';
import { uniqueArrayEntries } from './array';

const plugins = [
  'import',
  'unicorn',
  'promise',
  'sonarjs',
  'simple-import-sort',
];

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
    es6: true,
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

export const detectPlugins = (
  dependencies: Dependencies,
  customPlugins?: string[]
): string[] => {
  return uniqueArrayEntries([
    ...plugins,
    ...(dependencies.hasTailwind ? ['tailwindcss'] : []),
    ...(customPlugins ?? []),
  ]);
};
